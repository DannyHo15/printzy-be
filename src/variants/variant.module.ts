// src/variants/variants.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VariantsService } from './variant.service';
import { VariantsController } from './variant.controller';
import { Variant } from './entities/variant.entity';
import { VariantOptionValue } from './entities/variant-option-value.entity';
import { Upload } from '@app/uploads/entities/upload.entity';
import { CartItem } from '@app/carts/entities/cart-item.entity';
import { OrderItem } from '@app/orders/entities/orderItem.entity';
import { VariantMockup } from '@app/uploads/entities/variant-mockup.entity';
import { VariantDesign } from '@app/uploads/entities/variant-design.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Variant,
      VariantOptionValue,
      Upload,
      VariantMockup,
      VariantDesign,
      CartItem,
      OrderItem,
    ]),
  ],
  controllers: [VariantsController],
  providers: [VariantsService],
  exports: [VariantsService],
})
export class VariantsModule {}
