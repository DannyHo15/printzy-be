import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';

import { RefreshToken } from '@authentication/entities/refresh-token.entity';
import { Client } from '@clients/entities/client.entity'; // Import Cart entity
import { Role, Gender } from '@app/declarations';
import { Cart } from '@appcarts/entities/cart.entity';
import { Wishlist } from '@appwishlists/entities/wishlists.entity';
import { UserReview } from '@appreviews/entities/review.entity';
import { EGender, ERole } from '@apputils/variables';
import { ApiProperty } from '@nestjs/swagger';
@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn()
  @ApiProperty({ description: 'The unique identifier of the user', example: 1 })
  id: number;
  @Column({ unique: true })
  @ApiProperty({
    description: 'The email of the user',
    uniqueItems: true,
    example: 'user@example.com',
  })
  email: string;
  @Column({
    nullable: true,
  })
  @ApiProperty({
    description: 'The first name of the user',
    nullable: true,
    example: 'John',
  })
  firstName: string;

  @Column({
    nullable: true,
  })
  @ApiProperty({
    description: 'The last name of the user',
    nullable: true,
    required: false,
    example: 'Doe',
  })
  lastName: string;

  @Column({ select: false })
  password: string;

  @Column({ type: 'enum', enum: ERole, default: 'client' })
  role: Role;

  @Column({
    type: 'enum',
    enum: EGender,
    nullable: true,
  })
  @ApiProperty({
    description: 'The gender of the user',
    enum: EGender,
    nullable: true,
    example: 'male',
    required: false,
  })
  gender: Gender;

  @OneToMany(() => Client, (client) => client.user, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  clients: Client[];

  client?: Client;

  @OneToMany(() => RefreshToken, (refreshToken) => refreshToken.user, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  refreshTokens: RefreshToken[];

  // Add OneToMany relationship with Cart
  @OneToMany(() => Cart, (cart) => cart.user, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @ApiProperty({
    type: () => [Cart],
    description: 'The carts associated with the user',
    required: false,
  })
  carts: Cart[];

  // Add OneToMany relationship with Wishlist
  @OneToMany(() => Wishlist, (wishlist) => wishlist.user, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  wishlists: Wishlist[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => UserReview, (review) => review.user, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  reviews: UserReview[];
  @ApiProperty({
    description: 'The full name of the user',
    example: 'John Doe',
    required: false,
  })
  get fullName(): string {
    const firstName = this.firstName || '';
    const lastName = this.lastName || '';
    return `${firstName} ${lastName}`.trim();
  }
}
