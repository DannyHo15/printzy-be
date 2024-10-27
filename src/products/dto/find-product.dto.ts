import { ApiProperty } from '@nestjs/swagger';
import { IsObject, IsOptional } from 'class-validator';

import { IFieldQuery } from '@app/declarations';

export class FindProductDto {
  @ApiProperty()
  @IsOptional()
  $limit?: number;

  @ApiProperty()
  @IsOptional()
  $skip?: number;

  @ApiProperty()
  @IsOptional()
  id?: number | IFieldQuery<number>;

  @ApiProperty()
  @IsOptional()
  price?: number | IFieldQuery<number>;

  @ApiProperty()
  @IsOptional()
  name?: string | IFieldQuery<string>;

  @ApiProperty()
  @IsOptional()
  isAvailable?: boolean | IFieldQuery<boolean>;

  @ApiProperty()
  @IsOptional()
  description?: string | IFieldQuery<string>;

  @ApiProperty()
  @IsOptional()
  categoryId?: number;

  @ApiProperty()
  @IsOptional()
  collectionId?: number;

  @ApiProperty()
  @IsOptional()
  uploadId?: number;

  @ApiProperty()
  @IsOptional()
  createdAt?: Date | IFieldQuery<Date>;

  @ApiProperty()
  @IsOptional()
  updatedAt?: Date | IFieldQuery<Date>;

  @IsOptional()
  @IsObject()
  options?: Record<string, string>;
}
