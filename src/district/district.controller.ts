import { Controller, Get, Param, Query } from '@nestjs/common';
import { DistrictService } from './district.service';
import { ApiPaginationQuery, Paginated, PaginateQuery } from 'nestjs-paginate';
import { DistrictPaginateConfig } from './configs/district.config';
import { District } from './entities/district.entity';
import { ApiQuery, ApiTags } from '@nestjs/swagger';

@Controller('district')
@ApiTags('District')
export class DistrictController {
  constructor(private readonly districtService: DistrictService) {}

  @Get()
  @ApiPaginationQuery(DistrictPaginateConfig)
  findAll(@Query() query: PaginateQuery): Promise<Paginated<District>> {
    return this.districtService.findAll(query);
  }

  @Get('province')
  @ApiQuery({
    name: 'province_code',
    required: false,
    type: String,
  })
  findByProvinceCode(@Query('province_id') province_id: number) {
    return this.districtService.findByProvinceCode(province_id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.districtService.findOne(+id);
  }
}
