import { Module } from '@nestjs/common';
import { AnalyticsController } from './analytics.controller';
import { AnalyticsService } from './analytics.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderItem } from '@app/orders/entities/orderItem.entity';
import { Order } from '@app/orders/entities/order.entity';

@Module({
  imports: [TypeOrmModule.forFeature([OrderItem, Order])],
  controllers: [AnalyticsController],
  providers: [AnalyticsService],
})
export class AnalyticsModule {}
