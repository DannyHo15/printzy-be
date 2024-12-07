import { OrderStatus } from '@app/utils/types/order';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional,
  IsInt,
  Min,
  IsEnum,
  IsArray,
} from 'class-validator';

export class CreateOrderItemDto {
  @ApiProperty({
    description: 'ID of the product variant',
    example: 1,
  })
  @IsNotEmpty()
  variantId: number;

  @ApiProperty({
    description: 'Quantity of the product variant',
    example: 2,
  })
  @IsInt()
  @Min(1)
  quantity: number;

  @ApiProperty({
    description: 'Unit price of the product variant',
    example: 100.0,
  })
  @IsInt()
  @Min(0)
  unitPrice: number;

  @ApiProperty({
    description: 'ID of the customize upload',
    example: 1,
  })
  @IsNotEmpty()
  customizeUploadId: number;
}

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
    description: 'ID of the client',
    example: 1,
  })
  @IsOptional()
  clientId: number;

  @ApiProperty({
    description: 'Array of order items',
    type: [CreateOrderItemDto],
    required: true,
  })
  @IsArray()
  orderItems: CreateOrderItemDto[];
}
