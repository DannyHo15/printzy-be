import { Injectable } from '@nestjs/common';
import { CreateWardDto } from './dto/create-ward.dto';
import { UpdateWardDto } from './dto/update-ward.dto';
import { paginate, Paginated, PaginateQuery } from 'nestjs-paginate';
import { Ward } from './entities/ward.entity';
import { WardPaginateConfig } from './configs/ward.config';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class WardService {
  constructor(
    @InjectRepository(Ward) private readonly wardRepository: Repository<Ward>,
  ) {}

  findAll(query: PaginateQuery): Promise<Paginated<Ward>> {
    return paginate(query, this.wardRepository, WardPaginateConfig);
  }

  findWardByDistrictCode(districtId: number): Promise<Ward[]> {
    return this.wardRepository
      .createQueryBuilder('ward')
      .leftJoinAndSelect('ward.district', 'district')
      .where('district.id = :districtId', { districtId })
      .andWhere('district.provinceId is not null')
      .getMany();
  }

  findOne(id: number) {
    return `This action returns a #${id} ward`;
  }

  update(id: number, updateWardDto: UpdateWardDto) {
    return `This action updates a #${id} ward`;
  }

  remove(id: number) {
    return `This action removes a #${id} ward`;
  }
}
