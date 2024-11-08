import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository } from 'typeorm';

import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import { Address } from './entities/address.entity';
import { paginate, Paginated, PaginateQuery } from 'nestjs-paginate';
import { AddressPaginateConfig } from './configs/address.config';
import { Province } from '@app/province/entities/province.entity';
import { District } from '@app/district/entities/district.entity';
import { Ward } from '@app/ward/entities/ward.entity';
import { User } from '@app/users/entities/user.entity';

@Injectable()
export class AddressesService {
  constructor(
    @InjectRepository(Address) private addressesRepository: Repository<Address>,
    @InjectRepository(Province)
    private provincesRepository: Repository<Province>,
    @InjectRepository(District)
    private districtsRepository: Repository<District>,
    @InjectRepository(Ward) private wardsRepository: Repository<Ward>,
    @InjectRepository(User) private usersRepository: Repository<User>,
  ) {}

  public async create(createAddressDto: CreateAddressDto) {
    const [_, count] = await this.addressesRepository.findAndCount();
    const user = await this.usersRepository.findOne({
      where: { id: createAddressDto.userId },
    });

    const isFirstAddress = count === 0;

    if (!user) {
      throw new UnprocessableEntityException('User not found');
    }
    if (count >= 3) {
      throw new UnprocessableEntityException('You can only have 3 addresses');
    }
    const province = await this.provincesRepository.findOne({
      where: { id: createAddressDto.provinceId },
    });
    if (!province) {
      throw new Error('Province not found');
    }

    const district = await this.districtsRepository.findOne({
      where: { id: createAddressDto.districtId },
    });
    if (!district) {
      throw new Error('District not found');
    }

    const ward = await this.wardsRepository.findOne({
      where: { id: createAddressDto.wardId },
    });
    if (!ward) {
      throw new Error('Ward not found');
    }

    const address = this.addressesRepository.create({
      ...createAddressDto,
      province,
      district,
      ward,
      user,
      isDefault: isFirstAddress,
    });
    return this.addressesRepository.save(address);
  }

  public async findAll(
    query: PaginateQuery,
    userId: number,
  ): Promise<Paginated<Address>> {
    return paginate(query, this.addressesRepository, {
      ...AddressPaginateConfig,
      where: { user: { id: userId } },
    });
  }

  public async findOne(id: number) {
    const address = await this.addressesRepository.findOne({
      where: { id },
      relations: {
        province: true,
        district: true,
        ward: true,
        user: true,
      },
    });

    if (!address) {
      throw new UnprocessableEntityException('Address is not found');
    }

    return address;
  }

  public async findByClientId(id: number) {
    const addresses = await this.addressesRepository.find({
      where: { clientId: id },
    });

    if (!addresses) {
      throw new UnprocessableEntityException('Address is not found');
    }

    return addresses;
  }

  public async update(id: number, updateAddressDto: UpdateAddressDto) {
    const address = await this.addressesRepository.findOne({
      where: { id },
      relations: {
        user: true,
      },
    });

    if (!address) {
      throw new UnprocessableEntityException('Address is not found');
    }
    if (updateAddressDto.isDefault) {
      // Set all other addresses' default property to false
      await this.addressesRepository.update(
        { user: { id: address.user.id }, id: Not(id) },
        { isDefault: false },
      );
    }
    const updatedAddress = await this.addressesRepository.save({
      id,
      ...updateAddressDto,
    });

    return updatedAddress;
  }

  public async remove(id: number) {
    const address = await this.findOne(id);

    await this.addressesRepository.delete(id);

    return address;
  }
}
