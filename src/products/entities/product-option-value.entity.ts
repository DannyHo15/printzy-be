import { Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ProductOption } from './product-option.entity';
import { OptionValue } from '@app/options/entities/option-value.entity';

@Entity({ name: 'product_option_values' })
export class ProductOptionValue {
  @PrimaryGeneratedColumn()
  id: number;

  // Many-to-One relationship with ProductOption
  @ManyToOne(
    () => ProductOption,
    (productOption) => productOption.productOptionValues,
    {
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
  )
  productOption: ProductOption;

  // Many-to-One relationship with OptionValue
  @ManyToOne(
    () => OptionValue,
    (optionValue) => optionValue.productOptionValues,
    {
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
  )
  optionValue: OptionValue;
}
