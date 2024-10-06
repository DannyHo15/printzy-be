import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { Category } from 'src/categories/entities/category.entity';
import { Purchase } from 'src/purchases/entities/purchase.entity';
import { Upload } from 'src/uploads/entities/upload.entity';
import { Photo } from 'src/photos/entities/photo.entity';
import { Wishlist } from '@appwishlists/entities/wishlists.entity';

@Entity({ name: 'products' })
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('decimal', { precision: 30, scale: 2 })
  price: number;

  @Column()
  name: string;

  @Column('text')
  description: string;

  // Adding properties specific to e-commerce clothing and accessories
  @Column({ nullable: true })
  size: string; // For shirts, phone cases, etc.

  @Column({ nullable: true })
  color: string; // For customizable items

  @Column({ nullable: true })
  material: string; // For material of products like mugs, cases, etc.

  @Column('boolean', { default: true })
  isAvailable: boolean;

  @Column('int', { nullable: true })
  stock: number; // Amount of stock available

  // Dimensions specific for products like phone cases or glasses
  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  height: number;

  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  width: number;

  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  length: number;

  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  weight: number; // Weight for shipping calculation

  @ManyToOne(() => Category, (category) => category.products, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  category: Category;

  @Column()
  categoryId: number;

  @OneToMany(() => Purchase, (purchase) => purchase.product, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  purchases: Purchase[];

  @ManyToOne(() => Upload, (upload) => upload.products, {
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
    nullable: true,
    eager: true,
  })
  upload: Upload;

  @OneToMany(() => Photo, (photo) => photo.product, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    eager: true,
  })
  photos: Photo[];

  // OneToMany relationship with Wishlist
  @OneToMany(() => Wishlist, (wishlist) => wishlist.product, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  wishlists: Wishlist[];

  @Column({ nullable: true })
  uploadId: number;

  @Column('boolean', { default: false })
  isDeleted: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
