import {
  ForbiddenException,
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';
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
import { Client } from '@app/clients/entities/client.entity';

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
    @InjectRepository(Client) private clientRepository: Repository<Client>,
  ) {}

  public async create(createAddressDto: CreateAddressDto) {
    const [_, count] = await this.addressesRepository.findAndCount({
      where: { client: { id: createAddressDto.clientId } },
    });

    const client = await this.clientRepository.findOne({
      where: { id: createAddressDto.clientId },
    });

    const isFirstAddress = count === 0;

    if (!client) {
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
      client,
      ward,
      isDefault: isFirstAddress,
    });
    return this.addressesRepository.save(address);
  }

  public async findAll(
    query: PaginateQuery,
    clientId: number,
  ): Promise<Paginated<Address>> {
    return paginate(query, this.addressesRepository, {
      ...AddressPaginateConfig,
      where: { client: { id: clientId } },
    });
  }

  public async findOne(id: number, user: User) {
    const address = await this.addressesRepository.findOne({
      where: { id },
      relations: {
        province: true,
        district: true,
        ward: true,
        client: true,
      },
    });

    if (!address) {
      throw new UnprocessableEntityException('Address is not found');
    }
    if (user.client.id !== address.client.id && user.role !== 'admin') {
      throw new ForbiddenException();
    }

    return address;
  }

  public async findByClientId(id: number) {
    const addresses = await this.addressesRepository.find({
      where: { client: { id } },
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
        client: true,
      },
    });

    if (!address) {
      throw new UnprocessableEntityException('Address is not found');
    }
    if (updateAddressDto.isDefault) {
      // Set all other addresses' default property to false
      await this.addressesRepository.update(
        { client: { id: address.client.id }, id: Not(id) },
        { isDefault: false },
      );
    }
    const updatedAddress = await this.addressesRepository.save({
      id,
      ...updateAddressDto,
    });

    return updatedAddress;
  }

  public async remove(id: number, user: User) {
    const address = await this.findOne(id, user);

    await this.addressesRepository.delete(id);

    return address;
  }
}
