import { PartialType } from '@nestjs/mapped-types';

import { CreateUserDto } from './create-user.dto';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @IsOptional()
  @IsString()
  @ApiProperty()
  readonly newPassword: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  readonly confirmPassword: string;
}
