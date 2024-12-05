import { OrderStatus } from '@app/utils/types/order';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsInt, Min, IsEnum } from 'class-validator';

export class CreateOrderDto {
  @ApiProperty({
    description: 'ID of the address',
    example: 1,
  })
  @IsNotEmpty()
  addressId: number;

  @ApiProperty({
    description: 'ID of the payment',
    example: 1,
  })
  @IsNotEmpty()
  paymentId: number;

  @ApiProperty({ enum: OrderStatus, default: OrderStatus.PROCESSING })
  @IsEnum(OrderStatus)
  @IsOptional()
  status?: OrderStatus;

  @ApiProperty({
    description: 'ID of the product variant, if applicable',
    required: false,
  })
  @IsOptional()
  variantId?: number;

  @IsOptional()
  clientId: number;

  @ApiProperty({ description: 'Quantity of the variant', example: 1 })
  @IsInt()
  @Min(1)
  quantity: number;

  @ApiProperty()
  @IsNotEmpty()
  productId: number;

  @ApiProperty({
    description: 'ID of the customization upload, if applicable',
    required: false,
  })
  @IsOptional()
  customizeUploadId?: number;
}
