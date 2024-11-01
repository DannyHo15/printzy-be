import { Injectable } from '@nestjs/common';
import { CreateDistrictDto } from './dto/create-district.dto';
import { UpdateDistrictDto } from './dto/update-district.dto';
import { paginate, Paginated, PaginateQuery } from 'nestjs-paginate';
import { District } from './entities/district.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DistrictPaginateConfig } from './configs/district.config';
@Injectable()
export class DistrictService {
  constructor(
    @InjectRepository(District)
    private readonly districtRepository: Repository<District>,
  ) {}
  create(createDistrictDto: CreateDistrictDto) {
    return 'This action adds a new district';
  }

  findAll(query: PaginateQuery): Promise<Paginated<District>> {
    return paginate(query, this.districtRepository, DistrictPaginateConfig);
  }

  findByProvinceCode(province_id: number): Promise<District[]> {
    return this.districtRepository
      .createQueryBuilder('district')
      .leftJoinAndSelect('district.province', 'province')
      .where('province.id = :province_id', { province_id })
      .getMany();
  }

  findOne(id: number) {
    return `This action returns a #${id} district`;
  }

  update(id: number, updateDistrictDto: UpdateDistrictDto) {
    return `This action updates a #${id} district`;
  }

  remove(id: number) {
    return `This action removes a #${id} district`;
  }
}
