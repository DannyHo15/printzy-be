import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsOptional, IsPositive } from 'class-validator';

export class AddToCartDto {
  @ApiProperty()
  @IsInt()
  productId: number;

  @ApiProperty({ required: false })
  @IsInt()
  @IsOptional()
  variantId?: number;

  @ApiProperty()
  @IsInt()
  customizeUploadId: number;

  @ApiProperty()
  @IsInt()
  customizePrintId: number;

  @ApiProperty()
  @IsInt()
  @IsPositive()
  quantity: number;
}
