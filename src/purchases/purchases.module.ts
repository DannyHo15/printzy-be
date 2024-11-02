import { TypeOrmModule } from '@nestjs/typeorm';
import { forwardRef, Module } from '@nestjs/common';

import { OrdersModule } from '@orders/orders.module';
import { PurchasesService } from './purchases.service';
import { PurchasesController } from './purchases.controller';
import { Purchase } from './entities/purchase.entity';
import { Product } from '@app/products/entities/product.entity';
import { Variant } from '@app/variants/entities/variant.entity';
import { CustomizeUpload } from '@app/customize-uploads/entities/customize-upload.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Purchase, Product, Variant, CustomizeUpload]),
    forwardRef(() => OrdersModule),
  ],
  controllers: [PurchasesController],
  providers: [PurchasesService],
  exports: [PurchasesService],
})
export class PurchasesModule {}
