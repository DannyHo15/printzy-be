import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cart } from './entities/cart.entity';
import { CartItem } from './entities/cart-item.entity';
import { Product } from 'src/products/entities/product.entity';
import { CustomizeUpload } from '@app/customize-uploads/entities/customize-upload.entity';
import { Variant } from '@app/variants/entities/variant.entity';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(Cart)
    private cartRepository: Repository<Cart>,
    @InjectRepository(CartItem)
    private cartItemRepository: Repository<CartItem>,
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    @InjectRepository(CustomizeUpload)
    private customizeUploadRepository: Repository<CustomizeUpload>,
    @InjectRepository(Variant)
    private variantRepository: Repository<Variant>, // Inject Variant repository
  ) {}

  async getCartByUser(userId: number): Promise<Cart> {
    let cart = await this.cartRepository.findOne({
      where: { userId },
      relations: [
        'cartItems',
        'cartItems.product',
        'cartItems.variant.variantOptionValues.optionValue',
      ],
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
    customizeUploadId?: number,
    variantId?: number, // Add variantId as an optional parameter
  ): Promise<Cart> {
    const cart = await this.getCartByUser(userId);
    const product = await this.productRepository.findOne({
      where: { id: productId },
    });

    if (!product) {
      throw new Error('Product not found');
    }

    let variant = null;
    if (variantId) {
      variant = await this.variantRepository.findOne({
        where: { id: variantId },
      });
      if (!variant) {
        throw new Error('Variant not found');
      }
    }

    const existingCartItem = cart.cartItems.find(
      (item) => item.product.id === productId && item.variant?.id === variantId, // Check if same product and variant
    );

    if (existingCartItem) {
      existingCartItem.quantity += quantity;
      await this.cartItemRepository.save(existingCartItem);
    } else {
      const customizeUpload = customizeUploadId
        ? await this.customizeUploadRepository.findOne({
            where: { id: customizeUploadId },
          })
        : null;

      const cartItem = this.cartItemRepository.create({
        product,
        cart,
        quantity,
        customizeUpload,
        variant, // Assign variant to the cart item
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
    variantId?: number, // Add variantId for updating the specific variant
  ): Promise<Cart> {
    const cart = await this.getCartByUser(userId);
    const cartItem = cart.cartItems.find(
      (item) => item.product.id === productId && item.variant?.id === variantId, // Find cart item by product and variant
    );

    if (!cartItem) {
      throw new Error('Product or variant not in cart');
    }

    cartItem.quantity = quantity;
    await this.cartItemRepository.save(cartItem);

    return cart;
  }

  async removeCartItem(
    userId: number,
    productId: number,
    variantId?: number,
  ): Promise<Cart> {
    const cart = await this.getCartByUser(userId);
    const cartItem = cart.cartItems.find(
      (item) => item.product.id === productId && item.variant?.id === variantId, // Find by both product and variant
    );

    if (!cartItem) {
      throw new Error('Product or variant not in cart');
    }

    await this.cartItemRepository.remove(cartItem);
    cart.cartItems = cart.cartItems.filter(
      (item) => item.product.id !== productId || item.variant?.id !== variantId, // Filter out the specific item
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
