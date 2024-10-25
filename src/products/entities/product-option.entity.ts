import { Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Product } from './product.entity';
import { Option } from '@app/options/entities/option.entity';
import { ProductOptionValue } from './product-option-value.entity';

@Entity({ name: 'product_options' })
export class ProductOption {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Product, (product) => product.productOptions, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  product: Product;

  @ManyToOne(() => Option, (option) => option.productOptions, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  option: Option;

  @OneToMany(
    () => ProductOptionValue,
    (productOptionValue) => productOptionValue.productOption,
    {
      cascade: true,
    },
  )
  productOptionValues: ProductOptionValue[];
}
