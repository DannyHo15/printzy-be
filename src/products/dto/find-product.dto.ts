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

  @ApiProperty({ type: [Number], required: false })
  @IsOptional()
  categoryId?: number | number[];

  @ApiProperty()
  @IsOptional()
  collectionId?: number;

  @IsOptional()
  @IsObject()
  options?: Record<string, string>;
}
