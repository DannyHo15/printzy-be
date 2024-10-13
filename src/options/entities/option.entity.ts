import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { OptionValue } from './option-value.entity';

@Entity({ name: 'options' })
export class Option {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string; // e.g., color, size

  @Column()
  productId: number; // e.g., color, size

  @OneToMany(() => OptionValue, (optionValue) => optionValue.option, {
    cascade: true,
  })
  optionValues: OptionValue[];
}
