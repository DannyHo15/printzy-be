// src/reviews/reviews.controller.ts
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Request,
} from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UserReview } from './entities/review.entity';

@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Post()
  async create(
    @Body() createReviewDto: CreateReviewDto,
    @Request() req,
  ): Promise<UserReview> {
    const userId = req.user.id; // Assuming you have user ID in request
    return this.reviewsService.createReview(createReviewDto, userId);
  }

  @Delete(':id')
  async delete(@Param('id') id: number): Promise<void> {
    return this.reviewsService.deleteReview(id);
  }

  @Get('product/:productId')
  async getByProduct(
    @Param('productId') productId: number,
  ): Promise<UserReview[]> {
    return this.reviewsService.getReviewsByProduct(productId);
  }
}
