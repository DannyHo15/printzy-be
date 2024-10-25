import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { WishlistController } from './wishlists.controller';
import { WishlistService } from './wishlists.service';
import { Wishlist } from './entities/wishlists.entity';
import { Product } from '@app/products/entities/product.entity';
import { User } from '@app/users/entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Wishlist, User, Product]), // Importing the required entities
  ],
  controllers: [WishlistController], // Registering the controller
  providers: [WishlistService], // Registering the service
  exports: [WishlistService], // Exporting the service for use in other modules (if needed)
})
export class WishlistModule {}
