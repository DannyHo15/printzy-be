import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class FindReviewProductDto {
  @ApiProperty()
  @IsOptional()
  $limit?: number; // Limit the number of results

  @ApiProperty()
  @IsOptional()
  $skip?: number; // Skip a certain number of results
}
