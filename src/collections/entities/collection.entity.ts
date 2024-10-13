import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Product } from '@products/entities/product.entity';
import { Category } from '@categories/entities/category.entity';

@Entity({ name: 'collections' })
export class Collection {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column('text', { nullable: true })
  description: string;

  // Each collection belongs to one category
  @ManyToOne(() => Category, (category) => category.collections, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    nullable: false,
  })
  category: Category;

  @Column()
  categoryId: number;

  // A collection can have many products
  @OneToMany(() => Product, (product) => product.collection, {
    cascade: true,
  })
  products: Product[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
