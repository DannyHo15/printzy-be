import { Module } from '@nestjs/common';
import { VNPayController } from './vn-pay.controller';
import { VNPayService } from './vn-pay.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Purchase } from '@app/purchases/entities/purchase.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Purchase])],
  controllers: [VNPayController],
  providers: [VNPayService],
})
export class VNPayModule {}
