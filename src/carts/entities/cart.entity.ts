import {
  Entity,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToOne,
  Column,
} from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { CartItem } from './cart-item.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity({ name: 'carts' })
export class Cart {
  @PrimaryGeneratedColumn()
  @ApiProperty()
  id: number;

  @ManyToOne(() => User, (user) => user.carts, {
    onDelete: 'CASCADE',
  })
  user: User;

  @Column()
  userId: number;

  @ApiProperty()
  @OneToMany(() => CartItem, (cartItem) => cartItem.cart, {
    cascade: true,
  })
  cartItems: CartItem[];
}
