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
  Query,
} from '@nestjs/common';
import { CartService } from './cart.service';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';
import { JWTGuard } from '@app/authentication/jwt.guard';
import { RolesGuard } from '@app/utils/guards/roles.guard';
import { Roles } from '@app/utils/decorators/role.decorator';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('cart')
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
    const {
      productId,
      quantity,
      customizeUploadId,
      customizePrintId,
      variantId,
    } = addToCartDto;
    return this.cartService.addToCart(
      userId,
      productId,
      quantity,
      customizeUploadId,
      customizePrintId,
      variantId, // Pass variantId to service
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
    const { productId, quantity, variantId } = updateCartItemDto;
    return this.cartService.updateCartItem(
      userId,
      productId,
      quantity,
      variantId,
    ); // Pass variantId to service
  }

  @UseGuards(JWTGuard, RolesGuard)
  @Roles('client')
  @Delete('remove')
  removeCartItem(
    @Req() { user },
    @Query('productId') productId: number,
    @Query('variantId') variantId: number,
  ) {
    const userId = user.id;
    return this.cartService.removeCartItem(userId, productId, variantId);
  }

  @UseGuards(JWTGuard, RolesGuard)
  @Roles('client')
  @Delete('clear')
  clearCart(@Req() { user }) {
    const userId = user.id;
    return this.cartService.clearCart(userId);
  }
}
