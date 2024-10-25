import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsArray,
  IsOptional,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProvinceDto {
  @ApiProperty({
    description: 'The name of the province',
    example: 'Thành phố Hà Nội',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'The code of the province',
    example: 1,
  })
  @IsNumber()
  @IsNotEmpty()
  code: number;

  @ApiProperty({
    description: 'The division type of the province',
    example: 'thành phố trung ương',
  })
  @IsString()
  @IsNotEmpty()
  division_type: string;

  @ApiProperty({
    description: 'The codename of the province',
    example: 'thanh_pho_ha_noi',
  })
  @IsString()
  @IsNotEmpty()
  codename: string;

  @ApiProperty({
    description: 'The phone code of the province',
    example: 24,
  })
  @IsNumber()
  @IsNotEmpty()
  phone_code: number;

  @ApiProperty({
    description: 'The districts in the province',
    type: [String], // Adjust the type as needed
    example: [],
  })
  @IsArray()
  @IsOptional()
  districts: string[];
}
