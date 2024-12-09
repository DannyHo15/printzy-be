import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
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

  @ManyToOne(() => Product, (product) => product.id, {
    onDelete: 'CASCADE',
    eager: true,
  })
  product: Product;

  @ManyToOne(() => Cart, (cart) => cart.cartItems, {
    onDelete: 'CASCADE',
  })
  cart: Cart;

  @ManyToOne(() => Variant, { nullable: true })  // Thay @OneToOne bằng @ManyToOne
  @JoinColumn()
  variant: Variant;

  @ManyToOne(() => CustomizeUpload, {
    onDelete: 'SET NULL',
    nullable: true,
  })
  @JoinColumn()
  customizeUpload: CustomizeUpload;

  @Column()
  productId: number;

  @Column({ nullable: true })
  variantId: number;

  @Column({ nullable: true })
  customizeUploadId: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

