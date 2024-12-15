// src/variants/dto/create-variant.dto.ts
import {
  IsInt,
  IsArray,
  ValidateNested,
  IsString,
  IsOptional,
  IsNumber,
  IsBoolean,
  IsObject,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class CreateVariantDto {
  @ApiProperty()
  @IsNumber(
    { maxDecimalPlaces: 2 },
    { message: 'Price must be a valid number with up to 2 decimal places' },
  )
  price: number;

  @ApiProperty()
  @IsNumber(
    { maxDecimalPlaces: 2 },
    { message: 'Price must be a valid number with up to 2 decimal places' },
  )
  baseCost: number;

  @ApiProperty()
  @IsString()
  sku: string;

  @ApiProperty({ required: false, default: true })
  @IsOptional()
  @IsBoolean()
  isAvailable?: boolean;

  @ApiProperty({ required: false, default: true })
  @IsOptional()
  @IsBoolean()
  isInStock?: boolean;

  @ApiProperty()
  @IsOptional()
  @IsInt()
  uploadId?: number;

  @ApiProperty()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => VariantOptionValueDto)
  optionValues: VariantOptionValueDto[];

  @ApiProperty({ required: false, type: Number, default: null })
  @IsOptional()
  @IsNumber()
  customizeModelId?: number;
}

export class VariantOptionValueDto {
  @ApiProperty()
  @IsInt()
  optionId: number;

  @ApiProperty()
  @IsInt()
  valueId: number;
}
