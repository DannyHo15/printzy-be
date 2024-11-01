import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { ProvinceService } from './province.service';
import { UpdateProvinceDto } from './dto/update-province.dto';
import { JWTGuard } from '@app/authentication/jwt.guard';
import { RolesGuard } from '@app/utils/guards/roles.guard';
import { Roles } from '@app/utils/decorators/role.decorator';
import { ApiQuery, ApiTags } from '@nestjs/swagger';
import { Province } from './entities/province.entity';
import { ApiPaginationQuery, Paginated, PaginateQuery } from 'nestjs-paginate';
import { ProvincePaginateConfig } from './configs/province.config';
@ApiTags('Province')
@Controller('province')
export class ProvinceController {
  constructor(private readonly provinceService: ProvinceService) {}
  @ApiPaginationQuery(ProvincePaginateConfig)
  @Get()
  findAll(@Query() query: PaginateQuery): Promise<Paginated<Province>> {
    return this.provinceService.findAll(query);
  }
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.provinceService.findOne(+id);
  }

  @UseGuards(JWTGuard, RolesGuard)
  @Roles('admin')
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateProvinceDto: UpdateProvinceDto,
  ) {
    return this.provinceService.update(+id, updateProvinceDto);
  }

  @UseGuards(JWTGuard)
  @Roles('admin')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.provinceService.remove(+id);
  }
}
