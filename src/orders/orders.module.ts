import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { PurchasesModule } from '@purchases/purchases.module';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { Order } from './entities/order.entity';
import { OrderItem } from './entities/orderItem.entity';
import { AddressesService } from '@app/addresses/addresses.service';
import { Address } from '@app/addresses/entities/address.entity';
import { Province } from '@app/province/entities/province.entity';
import { District } from '@app/district/entities/district.entity';
import { Ward } from '@app/ward/entities/ward.entity';
import { User } from '@app/users/entities/user.entity';
import { Client } from '@app/clients/entities/client.entity';
import { Payment } from '@app/payments/entities/payment.entity';
import { Variant } from '@app/variants/entities/variant.entity';
import { Purchase } from '@app/purchases/entities/purchase.entity';
import { CustomizeUpload } from '@app/customize-uploads/entities/customize-upload.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Order,
      OrderItem,
      Address,
      Province,
      District,
      Ward,
      User,
      Client,
      Payment,
      Variant,
      Purchase,
      CustomizeUpload,
    ]),
    forwardRef(() => PurchasesModule),
  ],
  controllers: [OrdersController],
  providers: [OrdersService, AddressesService],
  exports: [OrdersService],
})
export class OrdersModule {}
