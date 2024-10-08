// src/reviews/reviews.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserReview } from './entities/review.entity';
import { CreateReviewDto } from './dto/create-review.dto';
import { User } from 'src/users/entities/user.entity';
import { Product } from 'src/products/entities/product.entity';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectRepository(UserReview)
    private userReviewRepository: Repository<UserReview>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
  ) {}

  async createReview(
    createReviewDto: CreateReviewDto,
    userId: number,
  ): Promise<UserReview> {
    const { review, rating, productId } = createReviewDto;

    const product = await this.productRepository.findOne({
      where: { id: productId },
    });
    if (!product) {
      throw new Error('Product not found');
    }

    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new Error('User not found');
    }

    const userReview = this.userReviewRepository.create({
      review,
      rating,
      product,
      user,
    });

    return await this.userReviewRepository.save(userReview);
  }

  async deleteReview(reviewId: number): Promise<void> {
    const review = await this.userReviewRepository.findOne({
      where: { id: reviewId },
    });
    if (!review) {
      throw new Error('Review not found');
    }

    await this.userReviewRepository.remove(review);
  }

  async getReviewsByProduct(productId: number): Promise<UserReview[]> {
    return await this.userReviewRepository.find({
      where: { product: { id: productId } },
    });
  }
}
