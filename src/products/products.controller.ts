import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';

import { JWTGuard } from '@authentication/jwt.guard';
import { RolesGuard } from '@utils/guards/roles.guard';
import { Roles } from '@utils/decorators/role.decorator';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { FindProductDto } from './dto/find-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ApiTags } from '@nestjs/swagger';

@Controller('products')
@ApiTags('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @UseGuards(JWTGuard, RolesGuard)
  @Roles('admin', 'employee')
  @Post()
  public async create(@Body() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }

  @Get()
  public async findAll(@Query() query: FindProductDto) {
    return this.productsService.findAll(query);
  }

  @Get(':id')
  public async findOne(@Param('id') id: string) {
    return this.productsService.findOne(+id);
  }

  @Get('/detail/:slug')
  public async findOneBySlug(@Param('slug') slug: string) {
    return this.productsService.findOneBySlug(slug);
  }

  @Get('/sku/:sku')
  public async findOneBySKU(@Param('sku') sku: string) {
    return this.productsService.findOneBySKU(sku);
  }

  @UseGuards(JWTGuard, RolesGuard)
  @Roles('admin', 'employee')
  @Patch(':id')
  public async update(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    return this.productsService.update(+id, updateProductDto);
  }

  @UseGuards(JWTGuard, RolesGuard)
  @Roles('admin', 'employee')
  @Delete(':id')
  public async remove(@Param('id') id: string) {
    return this.productsService.remove(+id);
  }
}
