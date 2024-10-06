import { ApiProperty } from '@nestjs/swagger';
import { IsInt } from 'class-validator';

export class RemoveCartItemDto {
  @ApiProperty()
  @IsInt()
  productId: number;
}
