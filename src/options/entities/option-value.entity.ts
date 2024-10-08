import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Option } from './option.entity';

@Entity({ name: 'option_values' })
export class OptionValue {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  value: string;  // e.g., red, black, s, m, l

  @ManyToOne(() => Option, (option) => option.optionValues, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  option: Option;

  @Column()
  optionId: number;
}
