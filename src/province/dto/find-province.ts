import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

import { IFieldQuery } from '@app/declarations';

export class FindProvinceDto {
  @ApiProperty({ description: 'Limit the number of results' })
  @IsOptional()
  $limit?: number;

  @ApiProperty({ description: 'Skip a number of results' })
  @IsOptional()
  $skip?: number;

  @ApiProperty({ description: 'Filter by province ID' })
  @IsOptional()
  id?: number | IFieldQuery<number>;

  @ApiProperty({ description: 'Filter by creation date' })
  @IsOptional()
  createdAt?: Date | IFieldQuery<Date>;

  @ApiProperty({ description: 'Filter by update date' })
  @IsOptional()
  updatedAt?: Date | IFieldQuery<Date>;
}
