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
import { Role } from '@app/declarations';
import { Cart } from '@appcarts/entities/cart.entity';
import { Wishlist } from '@appwishlists/entities/wishlists.entity';
import { UserReview } from '@appreviews/entities/review.entity';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column({ select: false })
  password: string;

  @Column({ type: 'enum', enum: ['admin', 'client'], default: 'client' })
  role: Role;

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
}
