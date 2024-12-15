import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Variant } from './variant.entity';

@Entity({ name: 'customize_models' })
export class CustomizeModel {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('json', { nullable: true })
  data: any;

  @OneToMany(() => Variant, (variant) => variant.customizeModel)
  variants: Variant[];
}
