import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsNumber, IsArray } from 'class-validator';

export class CreateCategoryDto {
  @ApiProperty({ description: 'Name of the category' })
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'Description of the category' })
  @IsNotEmpty()
  description: string;

  @ApiProperty({ description: 'ID of the associated upload', required: false })
  @IsOptional()
  @IsNumber()
  uploadId?: number;

  @ApiProperty({
    description: 'Array of product IDs to link with the category',
    required: false,
  })
  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true })
  productIds?: number[];
}
