import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional,
  IsArray,
  ValidateNested,
  IsInt,
  Min,
  IsString,
  IsEmail,
  IsEnum,
} from 'class-validator';
import { Type } from 'class-transformer';

export enum OrderStatus {
  Processing = 'processing',
  Delivery = 'delivery',
  Completed = 'completed',
  Cancelled = 'cancelled',
}

class PurchaseItemDto {
  @ApiProperty()
  @IsNotEmpty()
  productId: number;

  @ApiProperty({ description: 'Quantity of the product', example: 1 })
  @IsInt()
  @Min(1)
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

export class CreateOrderDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  firstName: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  lastName: string;

  @ApiProperty()
  @IsNotEmpty()
  phone: string;

  @ApiProperty()
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiProperty()
  @IsNotEmpty()
  addressId: number;

  @ApiProperty()
  @IsOptional()
  clientId?: number;

  @ApiProperty({
    type: [PurchaseItemDto],
    description: 'List of purchases in the order',
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PurchaseItemDto)
  purchases: PurchaseItemDto[];

  @ApiProperty({ enum: OrderStatus, default: OrderStatus.Processing })
  @IsEnum(OrderStatus)
  @IsOptional()
  status?: OrderStatus;
}
