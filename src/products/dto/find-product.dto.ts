import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

import { IFieldQuery } from '@app/declarations';

export class FindProductDto {
  @ApiProperty()
  @IsOptional()
  $limit?: number; // Limit the number of results

  @ApiProperty()
  @IsOptional()
  $skip?: number; // Skip a certain number of results

  @ApiProperty()
  @IsOptional()
  id?: number | IFieldQuery<number>; // Search by product ID

  @ApiProperty()
  @IsOptional()
  price?: number | IFieldQuery<number>; // Search by price or apply conditions like ranges

  @ApiProperty()
  @IsOptional()
  name?: string | IFieldQuery<string>; // Search by product name with optional query conditions

  @ApiProperty()
  @IsOptional()
  isAvailable?: boolean | IFieldQuery<boolean>; // Filter based on availability

  @ApiProperty()
  @IsOptional()
  description?: string | IFieldQuery<string>; // Search by description

  @ApiProperty()
  @IsOptional()
  categoryId?: number; // Filter based on category ID

  @ApiProperty()
  @IsOptional()
  collectionId?: number;

  @ApiProperty()
  @IsOptional()
  uploadId?: number; // Filter based on associated upload ID

  @ApiProperty()
  @IsOptional()
  createdAt?: Date | IFieldQuery<Date>; // Search based on creation date

  @ApiProperty()
  @IsOptional()
  updatedAt?: Date | IFieldQuery<Date>; // Search based on last update date
}
