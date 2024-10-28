import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Product } from './product.entity';
import { Category } from '@app/categories/entities/category.entity';

@Entity({ name: 'category_products' })
export class CategoryProduct {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Category, (category) => category.categoryProducts, {
    onDelete: 'CASCADE',
    nullable: false,
  })
  category: Category;

  @ManyToOne(() => Product, (product) => product.categoryProducts, {
    onDelete: 'CASCADE',
    nullable: false,
  })
  product: Product;
}
