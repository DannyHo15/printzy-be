import { ApiProperty } from '@nestjs/swagger';

export class WishlistItemDto {
  @ApiProperty()
  productId: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  price: number;

  @ApiProperty()
  description: string;
}

export class WishlistResponseDto {
  @ApiProperty({ type: [WishlistItemDto] }) // Specify that items is an array of WishlistItemDto
  items: WishlistItemDto[];
}
