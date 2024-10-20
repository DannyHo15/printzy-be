import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsOptional, IsPositive } from 'class-validator';

export class UpdateCartItemDto {
  @ApiProperty()
  @IsInt()
  productId: number;

  @ApiProperty({ required: false })
  @IsInt()
  @IsOptional()
  variantId?: number;

  @ApiProperty()
  @IsInt()
  @IsPositive()
  quantity: number;
}
