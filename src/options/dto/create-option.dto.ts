// src/options/dto/create-option.dto.ts
import { IsNotEmpty } from 'class-validator';

export class CreateOptionDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty({ each: true })
  values: string[];
}
