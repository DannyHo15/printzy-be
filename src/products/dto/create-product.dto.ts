import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsBoolean,
} from 'class-validator';

export class CreateProductDto {
  @ApiProperty()
  @IsNumber({ allowNaN: false, allowInfinity: false })
  price: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  description: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  sku?: string; // SKU is optional in the entity

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  slug?: string; // Slug is defined in the entity but missing in DTO

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  isAvailable?: boolean; // Optional availability status

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber({ allowNaN: false, allowInfinity: false })
  stock?: number; // Optional stock information

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  categoryId: number; // CategoryId is required

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber({ allowNaN: false, allowInfinity: false })
  collectionId?: number; // Optional collection association

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber({ allowNaN: false, allowInfinity: false })
  uploadId?: number; // Optional upload association

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  isDeleted?: boolean; // Optional flag for soft deletion

  // Additional fields for dimensions and variations
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  size?: string; // Optional size for shirts, phone cases, etc.

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  color?: string; // Optional color for product variations

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  material?: string; // Optional material description

  @ApiProperty()
  @IsNumber({ allowNaN: false, allowInfinity: false })
  height: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber({ allowNaN: false, allowInfinity: false })
  width?: number; // Optional width for certain product types

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber({ allowNaN: false, allowInfinity: false })
  length?: number; // Optional length for certain product types

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber({ allowNaN: false, allowInfinity: false })
  weight?: number; // Optional weight for shipping purposes
}
