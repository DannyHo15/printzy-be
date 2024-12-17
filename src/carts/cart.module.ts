import { Module } from '@nestjs/common';
import { CartService } from './cart.service';
import { CartController } from './cart.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cart } from './entities/cart.entity';
import { CartItem } from './entities/cart-item.entity';
import { CustomizeUpload } from '@app/customize-uploads/entities/customize-upload.entity';
import { Variant } from '@app/variants/entities/variant.entity';
import { CustomizePrint } from '@app/customize-uploads/entities/customize-print.entity';
import { Product } from '@app/products/entities/product.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Cart,
      CartItem,
      Product,
      CustomizeUpload,
      CustomizePrint,
      Variant,
    ]), // Make these entities available
  ],
  controllers: [CartController],
  providers: [CartService],
})
export class CartModule {}
