import { ApiProperty } from '@nestjs/swagger';
import { IsEmpty, IsInt, IsOptional, IsPositive } from 'class-validator';

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

  @ApiProperty({ nullable: true })
  @IsInt()
  @IsOptional()
  customizePrintId: number | null;

  @ApiProperty()
  @IsInt()
  @IsPositive()
  quantity: number;
}
