import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateAddressDto {
  @ApiProperty()
  isDefault: boolean;

  @ApiProperty()
  @IsNotEmpty()
  addressDetail: string;

  @ApiProperty()
  @IsNotEmpty()
  phone: string;

  @ApiProperty()
  @IsNotEmpty()
  fullName: string;

  @ApiProperty()
  @IsNotEmpty()
  provinceId: number;

  @ApiProperty()
  @IsNotEmpty()
  districtId: number;

  @ApiProperty()
  wardId: number;

  @ApiProperty()
  clientId: number;
}
