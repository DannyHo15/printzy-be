// src/reviews/reviews.controller.ts
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UserReview } from './entities/review.entity';
import { JWTGuard } from '@app/authentication/jwt.guard';
import { RolesGuard } from '@app/utils/guards/roles.guard';
import { Roles } from '@app/utils/decorators/role.decorator';
import { FindReviewProductDto } from './dto/find-review-product.dto';

@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Get()
  public async findAll(@Query() query: FindReviewProductDto) {
    return this.reviewsService.findAll(query);
  }

  @UseGuards(JWTGuard, RolesGuard)
  @Roles('client')
  @Post()
  async create(
    @Body() createReviewDto: CreateReviewDto,
    @Req() { user },
  ): Promise<UserReview> {
    const userId = user.id;
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
