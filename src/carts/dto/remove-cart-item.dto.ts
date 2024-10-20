import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsOptional } from 'class-validator';

export class RemoveCartItemDto {
  @ApiProperty()
  @IsInt()
  productId: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsInt()
  variantId?: number;
}
