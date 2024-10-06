import { ApiProperty } from '@nestjs/swagger';

export class RemoveFromWishlistDto {
  @ApiProperty()
  productId: number;
}
