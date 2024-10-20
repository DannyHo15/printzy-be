import { Module } from '@nestjs/common';
import { CartService } from './cart.service';
import { CartController } from './cart.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cart } from './entities/cart.entity';
import { CartItem } from './entities/cart-item.entity';
import { Product } from 'src/products/entities/product.entity';
import { CustomizeUpload } from '@appcustomize-uploads/entities/customize-upload.entity';
import { Variant } from '@appvariants/entities/variant.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Cart,
      CartItem,
      Product,
      CustomizeUpload,
      Variant,
    ]), // Make these entities available
  ],
  controllers: [CartController],
  providers: [CartService],
})
export class CartModule {}
