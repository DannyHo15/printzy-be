import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { VariantOptionValue } from './variant-option-value.entity';
import { Product } from '@appproducts/entities/product.entity';

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
  price: number; // Price specific to the variant

  @Column('int')
  stock: number; // Stock specific to the variant

  @OneToMany(
    () => VariantOptionValue,
    (variantOptionValue) => variantOptionValue.variant,
    {
      cascade: true,
    },
  )
  variantOptionValues: VariantOptionValue[];
}
