// src/variants/variants.controller.ts
import { Controller, Post, Body, Param } from '@nestjs/common';
import { VariantsService } from './variant.service';
import { CreateVariantDto } from './dto/create-variant.dto';

@Controller('products/:productId/variants')
export class VariantsController {
  constructor(private readonly variantsService: VariantsService) {}

  @Post()
  async create(
    @Param('productId') productId: number,
    @Body() createVariantDto: CreateVariantDto,
  ) {
    return this.variantsService.create(createVariantDto, productId);
  }
}
