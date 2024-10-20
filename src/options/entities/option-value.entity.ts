import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Option } from './option.entity';
import { ProductOptionValue } from '@appproducts/entities/product-option-value.entity';

@Entity({ name: 'option_values' })
export class OptionValue {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  value: string; // e.g., red, black, s, m, l

  @ManyToOne(() => Option, (option) => option.optionValues, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  option: Option;

  @Column()
  optionId: number;

  // One-to-Many relationship with ProductOptionValue
  @OneToMany(
    () => ProductOptionValue,
    (productOptionValue) => productOptionValue.optionValue,
    {
      cascade: true,
    },
  )
  productOptionValues: ProductOptionValue[];
}
