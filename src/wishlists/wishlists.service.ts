import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Wishlist } from './entities/wishlists.entity';
import { User } from '@appusers/entities/user.entity';
import { Product } from '@appproducts/entities/product.entity';
import { AddToWishlistDto } from './dto/add-to-wishlist.dto';
import { RemoveFromWishlistDto } from './dto/remove-from-wishlist.dto';

@Injectable()
export class WishlistService {
  constructor(
    @InjectRepository(Wishlist)
    private wishlistRepository: Repository<Wishlist>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
  ) {}

  /**
   * Add a product to the user's wishlist
   */
  async addToWishlist(
    userId: number,
    addToWishlistDto: AddToWishlistDto,
  ): Promise<Wishlist> {
    const { productId } = addToWishlistDto;

    // Check if the user exists
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Check if the product exists
    const product = await this.productRepository.findOne({
      where: { id: productId },
    });
    if (!product) {
      throw new NotFoundException('Product not found');
    }

    // Check if the product is already in the user's wishlist
    const existingWishlist = await this.wishlistRepository.findOne({
      where: { user: { id: userId }, product: { id: productId } },
    });
    if (existingWishlist) {
      throw new ConflictException('Product already in wishlist');
    }

    // Create and save the new wishlist item
    const wishlist = this.wishlistRepository.create({
      user,
      product,
    });
    return this.wishlistRepository.save(wishlist);
  }

  /**
   * Remove a product from the user's wishlist
   */
  async removeFromWishlist(
    userId: number,
    removeFromWishlistDto: RemoveFromWishlistDto,
  ): Promise<void> {
    const { productId } = removeFromWishlistDto;

    // Check if the wishlist item exists
    const wishlistItem = await this.wishlistRepository.findOne({
      where: { user: { id: userId }, product: { id: productId } },
    });

    if (!wishlistItem) {
      throw new NotFoundException('Product not found in wishlist');
    }

    // Remove the wishlist item
    await this.wishlistRepository.remove(wishlistItem);
  }

  /**
   * Get the user's wishlist
   */
  async getWishlist(userId: number) {
    // Find all wishlist items for the user
    const wishlistItems = await this.wishlistRepository.find({
      where: { user: { id: userId } },
      relations: ['product'], // Load the related products
    });
    return wishlistItems;
  }
}
