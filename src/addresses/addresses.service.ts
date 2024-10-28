import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import mapQueryToFindOptions from '@utils/map-query-to-find-options';
import { CreateAddressDto } from './dto/create-address.dto';
import { FindAddressDto } from './dto/find-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import { Address } from './entities/address.entity';
import { paginate, Paginated, PaginateQuery } from 'nestjs-paginate';
import { AddressPaginateConfig } from './configs/address.config';
import { Province } from '@app/province/entities/province.entity';
import { District } from '@app/district/entities/district.entity';
import { Ward } from '@app/ward/entities/ward.entity';

@Injectable()
export class AddressesService {
  constructor(
    @InjectRepository(Address) private addressesRepository: Repository<Address>,
    @InjectRepository(Province)
    private provincesRepository: Repository<Province>,
    @InjectRepository(District)
    private districtsRepository: Repository<District>,
    @InjectRepository(Ward) private wardsRepository: Repository<Ward>,
  ) {}

  public async create(createAddressDto: CreateAddressDto) {
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
    });
    return this.addressesRepository.save(address);
  }

  public async findAll(
    query: PaginateQuery,
    userId: number,
  ): Promise<Paginated<Address>> {
    return paginate(query, this.addressesRepository, AddressPaginateConfig);
  }

  public async findOne(id: number) {
    const address = await this.addressesRepository.findOne({
      where: { id },
    });

    if (!address) {
      throw new UnprocessableEntityException('Address is not found');
    }

    return address;
  }

  public async update(id: number, updateAddressDto: UpdateAddressDto) {
    const address = await this.addressesRepository.findOne({
      where: { id },
    });

    if (!address) {
      throw new UnprocessableEntityException('Address is not found');
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
