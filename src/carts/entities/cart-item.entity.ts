import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Cart } from './cart.entity';
import { CustomizeUpload } from '@app/customize-uploads/entities/customize-upload.entity';
import { Variant } from '@app/variants/entities/variant.entity';
import { ApiProperty } from '@nestjs/swagger';
import { CustomizePrint } from '@app/customize-uploads/entities/customize-print.entity';
import { Product } from '@app/products/entities/product.entity';

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

  @ManyToOne(() => Variant, { nullable: true }) // Thay @OneToOne bằng @ManyToOne
  @JoinColumn()
  variant: Variant;

  @ManyToOne(() => CustomizeUpload, {
    onDelete: 'SET NULL',
    nullable: true,
  })
  @JoinColumn()
  customizeUpload: CustomizeUpload;

  @ManyToOne(() => CustomizePrint, {
    onDelete: 'SET NULL',
    nullable: true,
  })
  @JoinColumn()
  customizePrint: CustomizePrint;

  @Column()
  productId: number;

  @Column({ nullable: true })
  variantId: number;

  @Column({ nullable: true })
  customizeUploadId: number;

  @Column({ nullable: true })
  customizePrintId: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
