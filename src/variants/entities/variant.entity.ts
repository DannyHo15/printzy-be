import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { VariantOptionValue } from './variant-option-value.entity';
import { Product } from '@app/products/entities/product.entity';
import { Upload } from '@app/uploads/entities/upload.entity';

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

  @OneToMany(
    () => VariantOptionValue,
    (variantOptionValue) => variantOptionValue.variant,
    {
      cascade: true,
    },
  )
  variantOptionValues: VariantOptionValue[];

  @OneToOne(() => Upload, {
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
  @JoinColumn()
  upload: Upload;
}
