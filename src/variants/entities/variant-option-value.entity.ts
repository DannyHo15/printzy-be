import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Variant } from './variant.entity';
import { OptionValue } from '@appoptions/entities/option-value.entity';

@Entity({ name: 'variant_option_values' })
export class VariantOptionValue {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Variant, (variant) => variant.variantOptionValues, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  variant: Variant;

  @ManyToOne(() => OptionValue, (optionValue) => optionValue.id, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  optionValue: OptionValue;

  @Column()
  optionValueId: number;
}
