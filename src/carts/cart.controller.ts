import {
  Controller,
  Post,
  Param,
  Body,
  Delete,
  Put,
  Get,
} from '@nestjs/common';
import { CartService } from './cart.service';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';
import { RemoveCartItemDto } from './dto/remove-cart-item.dto';

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get(':userId')
  getCart(@Param('userId') userId: number) {
    return this.cartService.getCartByUser(userId);
  }

  @Post(':userId/add')
  addToCart(
    @Param('userId') userId: number,
    @Body() addToCartDto: AddToCartDto,
  ) {
    const { productId, quantity } = addToCartDto;
    return this.cartService.addToCart(userId, productId, quantity);
  }

  @Put(':userId/update')
  updateCartItem(
    @Param('userId') userId: number,
    @Body() updateCartItemDto: UpdateCartItemDto,
  ) {
    const { productId, quantity } = updateCartItemDto;
    return this.cartService.updateCartItem(userId, productId, quantity);
  }

  @Delete(':userId/remove')
  removeCartItem(
    @Param('userId') userId: number,
    @Body() removeCartItemDto: RemoveCartItemDto,
  ) {
    const { productId } = removeCartItemDto;
    return this.cartService.removeCartItem(userId, productId);
  }

  @Delete(':userId/clear')
  clearCart(@Param('userId') userId: number) {
    return this.cartService.clearCart(userId);
  }
}
