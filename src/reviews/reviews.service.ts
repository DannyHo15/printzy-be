// src/reviews/reviews.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserReview } from './entities/review.entity';
import { CreateReviewDto } from './dto/create-review.dto';
import mapQueryToFindOptions from '@app/utils/map-query-to-find-options';
import { FindReviewProductDto } from './dto/find-review-product.dto';
import { Product } from '@app/products/entities/product.entity';
import { User } from '@app/users/entities/user.entity';

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
    const { title, review, rating, productId } = createReviewDto;

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
      title,
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
      relations: ['user'],
    });
  }

  public async findAll(query: FindReviewProductDto) {
    const findOptions = mapQueryToFindOptions(query);

    const [data, total] = await this.userReviewRepository.findAndCount({
      ...findOptions,
      relations: ['product', 'user'], // Add collection relation
    });

    return {
      $limit: findOptions.take,
      $skip: findOptions.skip,
      total,
      data,
    };
  }
}
