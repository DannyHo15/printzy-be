import { Injectable, NotFoundException } from '@nestjs/common';
import { UpdateProvinceDto } from './dto/update-province.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Province } from './entities/province.entity';
import { Repository } from 'typeorm';
import { paginate, Paginated, PaginateQuery } from 'nestjs-paginate';
import { ProvincePaginateConfig } from './configs/province.config';

@Injectable()
export class ProvinceService {
  constructor(
    @InjectRepository(Province)
    private provinceRepository: Repository<Province>,
  ) {}

  async findAll(query: PaginateQuery): Promise<Paginated<Province>> {
    return paginate(query, this.provinceRepository, ProvincePaginateConfig);
  }

  async findOne(id: number) {
    const province = await this.provinceRepository.findOne({
      where: { id },
    });
    if (!province) {
      throw new NotFoundException(`Province with ID ${id} not found`);
    }
    return province;
  }

  update(id: number, updateProvinceDto: UpdateProvinceDto) {
    return `This action updates a #${id} province`;
  }

  remove(id: number) {
    return `This action removes a #${id} province`;
  }
}
