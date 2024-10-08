// src/variants/variants.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Variant } from './entities/variant.entity';
import { VariantOptionValue } from './entities/variant-option-value.entity';
import { CreateVariantDto } from './dto/create-variant.dto';

@Injectable()
export class VariantsService {
  constructor(
    @InjectRepository(Variant)
    private readonly variantRepository: Repository<Variant>,
    @InjectRepository(VariantOptionValue)
    private readonly variantOptionValueRepository: Repository<VariantOptionValue>,
  ) {}

  async create(
    createVariantDto: CreateVariantDto,
    productId: number,
  ): Promise<Variant> {
    const variant = this.variantRepository.create({
      price: createVariantDto.price,
      stock: createVariantDto.stock,
      product: { id: productId },
    });
    await this.variantRepository.save(variant);

    for (const optionValueDto of createVariantDto.optionValues) {
      const optionValue = await this.variantOptionValueRepository.findOne({
        where: {
          optionValueId: optionValueDto.valueId,
        },
      });

      const variantOptionValue = this.variantOptionValueRepository.create({
        variant,
        optionValue,
      });
      await this.variantOptionValueRepository.save(variantOptionValue);
    }

    return variant;
  }
}
