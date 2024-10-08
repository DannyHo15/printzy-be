// src/reviews/dto/create-review.dto.ts
import { IsInt, IsNotEmpty, IsString, Min, Max } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateReviewDto {
  @ApiProperty({ description: 'The content of the review' })
  @IsString()
  @IsNotEmpty()
  review: string;

  @ApiProperty({
    description: 'Rating given by the user (1 to 5)',
    minimum: 1,
    maximum: 5,
  })
  @IsInt()
  @Min(1)
  @Max(5)
  rating: number;

  @ApiProperty({ description: 'ID of the product being reviewed' })
  @IsInt()
  productId: number; // To associate the review with a product
}
