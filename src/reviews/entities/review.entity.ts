import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from 'src/users/entities/user.entity'; // Adjust the path as necessary
import { Product } from 'src/products/entities/product.entity'; // Adjust the path as necessary

@Entity({ name: 'user_reviews' })
export class UserReview {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text')
  review: string; // The review content

  @Column('int')
  rating: number; // Rating out of 5

  @ManyToOne(() => User, (user) => user.reviews, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  user: User;

  @ManyToOne(() => Product, (product) => product.reviews, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  product: Product;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
