import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class CreateCustomizeUploadDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsOptional()
  originalName: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsOptional()
  fileName: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsOptional()
  path: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsOptional()
  internalPath: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsOptional()
  mimetype: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsOptional()
  size: string;
}
