import { AddressSeedService } from './address-seed.service';
import { Province } from '@app/province/entities/province.entity';
import { District } from '@app/district/entities/district.entity';
import { Ward } from '@app/ward/entities/ward.entity';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Address } from '@app/addresses/entities/address.entity';
import { Client } from '@app/clients/entities/client.entity';
import { User } from '@app/users/entities/user.entity';
import { RefreshToken } from '@app/authentication/entities/refresh-token.entity';
import { Cart } from '@app/carts/entities/cart.entity';
import { CartItem } from '@app/carts/entities/cart-item.entity';
import { Product } from '@app/products/entities/product.entity';
import { Category } from '@app/categories/entities/category.entity';
import { Collection } from '@app/collections/entities/collection.entity';
import { Upload } from '@app/uploads/entities/upload.entity';
import { Photo } from '@app/photos/entities/photo.entity';
import { Purchase } from '@app/purchases/entities/purchase.entity';
import { Order } from '@app/orders/entities/order.entity';
import { Payment } from '@app/payments/entities/payment.entity';
import { Wishlist } from '@app/wishlists/entities/wishlists.entity';
import { Variant } from '@app/variants/entities/variant.entity';
import { VariantOptionValue } from '@app/variants/entities/variant-option-value.entity';
import { OptionValue } from '@app/options/entities/option-value.entity';
import { Option } from '@app/options/entities/option.entity';
import { ProductOption } from '@app/products/entities/product-option.entity';
import { ProductOptionValue } from '@app/products/entities/product-option-value.entity';
import { UserReview } from '@app/reviews/entities/review.entity';
import { CustomizeUpload } from '@app/customize-uploads/entities/customize-upload.entity';

@Module({
  providers: [AddressSeedService],
  imports: [
    TypeOrmModule.forFeature([
      Province,
      District,
      Ward,
      Address,
      Client,
      User,
      RefreshToken,
      Cart,
      CartItem,
      Product,
      Category,
      Collection,
      Upload,
      Photo,
      Purchase,
      Order,
      Payment,
      Wishlist,
      Variant,
      VariantOptionValue,
      OptionValue,
      Option,
      ProductOption,
      ProductOptionValue,
      UserReview,
      CustomizeUpload,
    ]),
  ],
  exports: [AddressSeedService],
})
export class AddressModule {}
