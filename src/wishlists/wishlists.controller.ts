import { Controller, Post, Delete, Get, Body, Req } from '@nestjs/common';

import { AddToWishlistDto } from './dto/add-to-wishlist.dto';
import { RemoveFromWishlistDto } from './dto/remove-from-wishlist.dto';
import { WishlistService } from './wishlists.service';
import { WishlistResponseDto } from './dto/wish-list-response.dto';

@Controller('wishlists')
export class WishlistController {
  constructor(private readonly wishlistService: WishlistService) {}

  // Add a product to the wishlist
  @Post('add')
  async addToWishlist(
    @Body() addToWishlistDto: AddToWishlistDto,
    @Req() { user },
  ) {
    const userId = user.id;
    return this.wishlistService.addToWishlist(userId, addToWishlistDto);
  }

  // Remove a product from the wishlist
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
  @Get()
  async getWishlist(@Req() { user }): Promise<WishlistResponseDto> {
    const userId = user.id;
    return this.wishlistService.getWishlist(userId);
  }
}
