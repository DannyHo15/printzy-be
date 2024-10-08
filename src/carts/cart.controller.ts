import {
  Controller,
  Post,
  Param,
  Body,
  Delete,
  Put,
  Get,
  UseGuards,
  Req,
} from '@nestjs/common';
import { CartService } from './cart.service';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';
import { RemoveCartItemDto } from './dto/remove-cart-item.dto';
import { JWTGuard } from '@appauthentication/jwt.guard';
import { RolesGuard } from '@apputils/guards/roles.guard';
import { Roles } from '@apputils/decorators/role.decorator';

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @UseGuards(JWTGuard, RolesGuard)
  @Roles('client')
  @Get('')
  getCart(@Req() { user }) {
    const userId = user.id;
    return this.cartService.getCartByUser(userId);
  }

  @UseGuards(JWTGuard, RolesGuard)
  @Roles('client')
  @Post('add')
  addToCart(@Req() { user }, @Body() addToCartDto: AddToCartDto) {
    const userId = user.id;
    const { productId, quantity, customizeUploadId } = addToCartDto;
    return this.cartService.addToCart(
      userId,
      productId,
      quantity,
      customizeUploadId,
    );
  }

  @UseGuards(JWTGuard, RolesGuard)
  @Roles('client')
  @Put('update')
  updateCartItem(
    @Req() { user },
    @Body() updateCartItemDto: UpdateCartItemDto,
  ) {
    const userId = user.id;
    const { productId, quantity } = updateCartItemDto;
    return this.cartService.updateCartItem(userId, productId, quantity);
  }

  @UseGuards(JWTGuard, RolesGuard)
  @Roles('client')
  @Delete('remove')
  removeCartItem(
    @Req() { user },
    @Body() removeCartItemDto: RemoveCartItemDto,
  ) {
    const userId = user.id;
    const { productId } = removeCartItemDto;
    return this.cartService.removeCartItem(userId, productId);
  }

  @UseGuards(JWTGuard, RolesGuard)
  @Roles('client')
  @Delete('clear')
  clearCart(@Req() { user }) {
    const userId = user.id;
    return this.cartService.clearCart(userId);
  }
}
