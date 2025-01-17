import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

import { IFieldQuery } from '@app/declarations';

export class FindClientDto {
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
  name?: string;

  @ApiProperty()
  @IsOptional()
  email?: string;

  @ApiProperty()
  @IsOptional()
  isActive?: boolean;

  @ApiProperty()
  @IsOptional()
  createdAt?: Date | IFieldQuery<Date>;

  @ApiProperty()
  @IsOptional()
  updatedAt?: Date | IFieldQuery<Date>;
}
