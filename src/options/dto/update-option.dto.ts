import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';

export class UpdateOptionDto {
  @ApiProperty()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsOptional() // Optional, since the values may not be updated
  @IsNotEmpty({ each: true })
  values?: string[];
}
