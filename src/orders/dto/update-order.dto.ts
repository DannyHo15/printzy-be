import { ApiProperty, PartialType } from '@nestjs/swagger';

import { CreateOrderDto } from './create-order.dto';
import { IsEnum, IsOptional } from 'class-validator';
import { OrderStatus } from '@app/utils/types/order';

export class UpdateOrderDto extends PartialType(CreateOrderDto) {
  @ApiProperty({ enum: OrderStatus, default: OrderStatus.UNPAID })
  @IsEnum(OrderStatus)
  @IsOptional()
  status?: OrderStatus;
}
