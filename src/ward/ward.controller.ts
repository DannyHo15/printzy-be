import { Controller, Get, Param, Query } from '@nestjs/common';
import { WardService } from './ward.service';
import { WardPaginateConfig } from './configs/ward.config';
import { ApiPaginationQuery, Paginated, PaginateQuery } from 'nestjs-paginate';
import { Ward } from './entities/ward.entity';
import { ApiTags } from '@nestjs/swagger';

@Controller('ward')
@ApiTags('Ward')
export class WardController {
  constructor(private readonly wardService: WardService) {}

  @Get()
  @ApiPaginationQuery(WardPaginateConfig)
  findAll(@Query() query: PaginateQuery): Promise<Paginated<Ward>> {
    return this.wardService.findAll(query);
  }

  @Get('district')
  findWardByDistrictCode(@Query('district_id') district_id: number) {
    return this.wardService.findWardByDistrictCode(district_id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.wardService.findOne(+id);
  }
}
