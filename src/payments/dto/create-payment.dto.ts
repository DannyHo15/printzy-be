import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsNumber, IsEnum } from 'class-validator';
import { PaymentMethod } from '../entities/payment.entity';

export class CreatePaymentDto {
  @ApiProperty({
    description: 'Tổng số tiền thanh toán',
  })
  @IsNumber({ allowNaN: false, allowInfinity: false })
  sum: number;

  @ApiProperty({
    description: 'ID của đơn hàng',
  })
  @IsNotEmpty()
  orderId: number;

  @ApiProperty({
    description: 'ID của khách hàng (nếu có)',
    required: false,
  })
  @IsOptional()
  clientId?: number;

  @ApiProperty({
    description: 'Phương thức thanh toán',
    enum: PaymentMethod,
    example: PaymentMethod.MOMO,
  })
  @IsEnum(PaymentMethod)
  @IsNotEmpty()
  paymentMethod: PaymentMethod;
}
