import {
  Controller,
  Post,
  Delete,
  Get,
  Body,
  Req,
  UseGuards,
} from '@nestjs/common';

import { AddToWishlistDto } from './dto/add-to-wishlist.dto';
import { RemoveFromWishlistDto } from './dto/remove-from-wishlist.dto';
import { WishlistService } from './wishlists.service';
import { JWTGuard } from '@appauthentication/jwt.guard';
import { RolesGuard } from '@apputils/guards/roles.guard';
import { Roles } from '@apputils/decorators/role.decorator';

@Controller('wishlists')
export class WishlistController {
  constructor(private readonly wishlistService: WishlistService) {}

  // Add a product to the wishlist
  @UseGuards(JWTGuard, RolesGuard)
  @Roles('client')
  @Post('add')
  async addToWishlist(
    @Body() addToWishlistDto: AddToWishlistDto,
    @Req() { user },
  ) {
    const userId = user.id;
    return this.wishlistService.addToWishlist(userId, addToWishlistDto);
  }

  // Remove a product from the wishlist
  @UseGuards(JWTGuard, RolesGuard)
  @Roles('client')
  @Delete('remove')
  async removeFromWishlist(
    @Body() removeFromWishlistDto: RemoveFromWishlistDto,
    @Req() { user },
  ) {
    const userId = user.id;
    return this.wishlistService.removeFromWishlist(
      userId,
      removeFromWishlistDto,
    );
  }

  // Get all wishlist products for a user
  @UseGuards(JWTGuard, RolesGuard)
  @Roles('client')
  @Get()
  async getWishlist(@Req() { user }) {
    const userId = user.id;
    return this.wishlistService.getWishlist(userId);
  }
}
