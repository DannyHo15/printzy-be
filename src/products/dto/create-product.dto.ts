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
  slug?: string; // Slug is defined in the entity but missing in DTO

  @ApiProperty({ required: false, default: true })
  @IsOptional()
  @IsBoolean()
  isAvailable?: boolean; // Optional availability status, defaults to true

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

  @ApiProperty({ required: false, default: false })
  @IsOptional()
  @IsBoolean()
  isDeleted?: boolean; // Optional flag for soft deletion, defaults to false

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber({ allowNaN: false, allowInfinity: false })
  discountPrice?: number; // Optional discount price
}
