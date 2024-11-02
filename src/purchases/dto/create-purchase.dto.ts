import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsInt, Min } from 'class-validator';

export class CreatePurchaseDto {
  @ApiProperty()
  @IsNotEmpty()
  productId: number;

  @ApiProperty()
  @IsNotEmpty()
  orderId: number;

  @ApiProperty()
  @IsOptional()
  clientId: number;

  @ApiProperty({
    description: 'Quantity of the product in the purchase',
    example: 1,
  })
  @IsInt()
  @Min(1)
  @IsNotEmpty()
  quantity: number;

  @ApiProperty({
    description: 'ID of the product variant, if applicable',
    required: false,
  })
  @IsOptional()
  variantId?: number;

  @ApiProperty({
    description: 'ID of the customization upload, if applicable',
    required: false,
  })
  @IsOptional()
  customizeUploadId?: number;
}
