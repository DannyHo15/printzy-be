import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { Product } from 'src/products/entities/product.entity';
import { Cart } from './cart.entity';
import { CustomizeUpload } from '@appcustomize-uploads/entities/customize-upload.entity';
import { Variant } from '@appvariants/entities/variant.entity';

@Entity({ name: 'cart_items' })
export class CartItem {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('int')
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

  @OneToOne(() => Variant, { nullable: true })
  @JoinColumn()
  variant: Variant;

  @OneToOne(() => CustomizeUpload, {
    onDelete: 'SET NULL',
    nullable: true,
  })
  @JoinColumn()
  customizeUpload: CustomizeUpload;

  @Column()
  productId: number;
}
