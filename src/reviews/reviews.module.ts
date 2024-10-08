// src/reviews/reviews.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserReview } from './entities/review.entity';
import { ReviewsService } from './reviews.service';
import { ReviewsController } from './reviews.controller';
import { User } from '@appusers/entities/user.entity';
import { Product } from '@appproducts/entities/product.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserReview, User, Product])],
  providers: [ReviewsService],
  controllers: [ReviewsController],
})
export class ReviewsModule {}
