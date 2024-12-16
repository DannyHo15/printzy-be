import {
  Column,
  Entity,
  JoinColumn,
  ManyToMany,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { VariantOptionValue } from './variant-option-value.entity';
import { Product } from '@app/products/entities/product.entity';
import { Upload } from '@app/uploads/entities/upload.entity';
import { OrderItem } from '@app/orders/entities/orderItem.entity';
import { VariantMockup } from '@app/uploads/entities/variant-mockup.entity';
import { VariantDesign } from '@app/uploads/entities/variant-design.entity';

@Entity({ name: 'variants' })
export class Variant {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Product, (product) => product.variants, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  product: Product;

  @Column()
  productId: number;

  @Column('decimal', { precision: 30, scale: 2 })
  price: number;

  @Column('decimal', { precision: 30, scale: 2 })
  baseCost: number;

  @Column()
  sku: string;

  @Column('boolean', { default: true })
  isAvailable: boolean;

  @Column('boolean', { default: true })
  isInStock: boolean;

  @OneToMany(
    () => VariantOptionValue,
    (variantOptionValue) => variantOptionValue.variant,
    {
      cascade: true,
    },
  )
  variantOptionValues: VariantOptionValue[];

  @ManyToMany(() => OrderItem, (orderItem) => orderItem.variant)
  orderItems: OrderItem[];

  @OneToOne(() => Upload, {
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
  @JoinColumn()
  upload: Upload;

  @OneToOne(() => VariantMockup, {
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
  @JoinColumn()
  variantMockup: VariantMockup;

  @ManyToOne(() => VariantDesign, (variantDesign) => variantDesign.variants, {
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
  @JoinColumn()
  variantDesign: VariantDesign;
}
