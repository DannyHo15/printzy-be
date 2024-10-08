// src/variants/dto/create-variant.dto.ts
import {
  IsNotEmpty,
  IsDecimal,
  IsInt,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateVariantDto {
  @IsDecimal()
  price: number;

  @IsInt()
  stock: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => VariantOptionValueDto)
  optionValues: VariantOptionValueDto[];
}

export class VariantOptionValueDto {
  @IsInt()
  optionId: number;

  @IsInt()
  valueId: number;
}
