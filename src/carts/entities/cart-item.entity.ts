import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Product } from 'src/products/entities/product.entity';
import { Cart } from './cart.entity';
import { CustomizeUpload } from '@app/customize-uploads/entities/customize-upload.entity';
import { Variant } from '@app/variants/entities/variant.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity({ name: 'cart_items' })
export class CartItem {
  @PrimaryGeneratedColumn()
  @ApiProperty()
  id: number;

  @Column('int')
  @ApiProperty()
  quantity: number;

  @ApiProperty()
  @ManyToOne(() => Product, (product) => product.id, {
    onDelete: 'CASCADE',
    eager: true,
  })
  product: Product;

  @ManyToOne(() => Cart, (cart) => cart.cartItems, {
    onDelete: 'CASCADE',
  })
  cart: Cart;

  @ApiProperty()
  @OneToOne(() => Variant, { nullable: true })
  @JoinColumn()
  variant: Variant;

  @ApiProperty()
  @OneToOne(() => CustomizeUpload, {
    onDelete: 'SET NULL',
    nullable: true,
  })
  @JoinColumn()
  customizeUpload: CustomizeUpload;

  @ApiProperty()
  @Column()
  productId: number;
  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
