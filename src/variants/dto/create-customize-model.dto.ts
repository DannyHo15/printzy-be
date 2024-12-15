// src/variants/dto/create-variant.dto.ts
import { IsOptional, IsObject } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCustomizeModelDto {
  @ApiProperty({ required: false, type: Object, default: null })
  @IsOptional()
  @IsObject()
  customizeModel?: Record<string, any>;
}
