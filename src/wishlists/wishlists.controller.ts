import {
  Controller,
  Post,
  Delete,
  Get,
  Body,
  Req,
  UseGuards,
  Param,
} from '@nestjs/common';

import { AddToWishlistDto } from './dto/add-to-wishlist.dto';
import { RemoveFromWishlistDto } from './dto/remove-from-wishlist.dto';
import { WishlistService } from './wishlists.service';
import { JWTGuard } from '@app/authentication/jwt.guard';
import { RolesGuard } from '@app/utils/guards/roles.guard';
import { Roles } from '@app/utils/decorators/role.decorator';

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
  @Delete('remove/:productId')
  async removeFromWishlist(
    @Param('productId') productId: string,
    @Req() { user },
  ) {
    const userId = user.id;
    return this.wishlistService.removeFromWishlist(userId, {
      productId: +productId,
    });
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
