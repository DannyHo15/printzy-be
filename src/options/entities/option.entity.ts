import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { OptionValue } from './option-value.entity';
import { ProductOption } from '@appproducts/entities/product-option.entity';

@Entity({ name: 'options' })
export class Option {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string; // e.g., color, size

  @OneToMany(() => OptionValue, (optionValue) => optionValue.option, {
    cascade: true,
  })
  optionValues: OptionValue[];

  // One-to-Many relationship with ProductOption
  @OneToMany(() => ProductOption, (productOption) => productOption.option, {
    cascade: true,
  })
  productOptions: ProductOption[];
}
