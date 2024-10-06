import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cart } from './entities/cart.entity';
import { CartItem } from './entities/cart-item.entity';
import { Product } from 'src/products/entities/product.entity';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(Cart)
    private cartRepository: Repository<Cart>,
    @InjectRepository(CartItem)
    private cartItemRepository: Repository<CartItem>,
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
  ) {}

  async getCartByUser(userId: number): Promise<Cart> {
    let cart = await this.cartRepository.findOne({
      where: { userId },
      relations: ['cartItems', 'cartItems.product'],
    });

    if (!cart) {
      cart = this.cartRepository.create({ userId, cartItems: [] });
      await this.cartRepository.save(cart);
    }

    return cart;
  }

  async addToCart(
    userId: number,
    productId: number,
    quantity: number,
  ): Promise<Cart> {
    const cart = await this.getCartByUser(userId);
    const product = await this.productRepository.findOne({
      where: { id: productId },
    });

    if (!product) {
      throw new Error('Product not found');
    }

    const existingCartItem = cart.cartItems.find(
      (item) => item.product.id === productId,
    );

    if (existingCartItem) {
      existingCartItem.quantity += quantity;
      await this.cartItemRepository.save(existingCartItem);
    } else {
      const cartItem = this.cartItemRepository.create({
        product,
        cart,
        quantity,
      });
      cart.cartItems.push(cartItem);
      await this.cartItemRepository.save(cartItem);
    }

    return this.cartRepository.save(cart);
  }

  async updateCartItem(
    userId: number,
    productId: number,
    quantity: number,
  ): Promise<Cart> {
    const cart = await this.getCartByUser(userId);
    const cartItem = cart.cartItems.find(
      (item) => item.product.id === productId,
    );

    if (!cartItem) {
      throw new Error('Product not in cart');
    }

    cartItem.quantity = quantity;
    await this.cartItemRepository.save(cartItem);

    return cart;
  }

  async removeCartItem(userId: number, productId: number): Promise<Cart> {
    const cart = await this.getCartByUser(userId);
    const cartItem = cart.cartItems.find(
      (item) => item.product.id === productId,
    );

    if (!cartItem) {
      throw new Error('Product not in cart');
    }

    await this.cartItemRepository.remove(cartItem);
    cart.cartItems = cart.cartItems.filter(
      (item) => item.product.id !== productId,
    );

    return this.cartRepository.save(cart);
  }

  async clearCart(userId: number): Promise<void> {
    const cart = await this.getCartByUser(userId);
    await this.cartItemRepository.remove(cart.cartItems);
    cart.cartItems = [];
    await this.cartRepository.save(cart);
  }
}
