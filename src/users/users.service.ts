import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { compare, genSalt, hash } from 'bcrypt';

import mapQueryToFindOptions from '@utils/map-query-to-find-options';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { FindUserDto } from './dto/find-user.dto';
import { User } from './entities/user.entity';
import { Client } from '@app/clients/entities/client.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
  ) {}

  public async create(createUserDto: CreateUserDto, client?: Client) {
    const existingUser = await this.usersRepository.findOne({
      where: { email: createUserDto.email },
    });

    if (existingUser) {
      throw new BadRequestException('This email is already taken');
    }

    const hashedPassword = await hash(createUserDto.password, await genSalt());

    const createdUser = await this.usersRepository.save({
      ...createUserDto,
      client,
      password: hashedPassword,
    });

    return createdUser;
  }

  public async findAll(query: FindUserDto) {
    const findOptions = mapQueryToFindOptions(query);

    const [data, total] = await this.usersRepository.findAndCount(findOptions);

    return {
      $limit: findOptions.take,
      $skip: findOptions.skip,
      total,
      data,
    };
  }

  public async findOne(id: number) {
    const user = await this.usersRepository.findOne({
      where: { id },
      relations: ['client'],
    });

    if (!user) {
      throw new UnprocessableEntityException(`User with ID ${id} not found`);
    }

    return {
      ...user,
      fullName: user.fullName,
      client: user.client,
    };
  }

  public async changePassword(
    currentUser: User,
    currentPassword: string,
    newPassword: string,
    confirmNewPassword: string,
  ) {
    const isPasswordValid = await this.validateCredentials(
      currentUser.id,
      currentPassword,
    );
    const isPasswordNotChange = await this.validateCredentials(
      currentUser.id,
      newPassword,
    );
    const isConfirmPassworkNotMatch = await compare(
      newPassword,
      confirmNewPassword,
    );
    if (!isPasswordValid) {
      throw new BadRequestException('Current password is incorrect');
    }

    if (isPasswordNotChange) {
      throw new BadRequestException(
        'New password must not be the same as the old password',
      );
    }

    if (isConfirmPassworkNotMatch) {
      throw new BadRequestException('Confirm password not match');
    }

    const hashedPassword = await hash(newPassword, await genSalt());

    currentUser.password = hashedPassword;

    return { message: 'Password changed successfully' };
  }

  public async update(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.usersRepository.findOne({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException('User is not found');
    }

    if (updateUserDto.email) {
      const existingUser = await this.usersRepository.findOne({
        where: { email: updateUserDto.email },
      });

      if (existingUser && user.id !== existingUser.id) {
        throw new ConflictException('This email is already taken');
      }
    }

    // Handle password change if necessary
    if (
      updateUserDto.password &&
      updateUserDto.newPassword &&
      updateUserDto.confirmPassword
    ) {
      await this.changePassword(
        user,
        updateUserDto.password,
        updateUserDto.newPassword,
        updateUserDto.confirmPassword,
      );
    }

    // Filter out undefined properties
    const updatedUser = await this.usersRepository.save({
      ...user, // Keep existing user properties
      ...updateUserDto, // Update with new values
    });

    return updatedUser;
  }

  public async remove(id: number) {
    const user = await this.findOne(id);

    await this.usersRepository.delete(id);

    return user;
  }

  public async validateCredentials(
    userId: number,
    password: string,
  ): Promise<boolean> {
    const user = await this.usersRepository
      .createQueryBuilder()
      .select('User.id')
      .addSelect('User.password')
      .where({
        id: userId,
      })
      .getOne();

    return compare(password, user.password);
  }
}
