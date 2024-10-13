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
import { UserReview } from '@appreviews/entities/review.entity';
import { Variant } from '@appvariants/entities/variant.entity';
import { Collection } from '@appcollections/entities/collection.entity';

@Entity({ name: 'products' })
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('decimal', { precision: 30, scale: 2 })
  price: number;

  @Column('decimal', { precision: 30, scale: 2, nullable: true })
  discountPrice: number;

  @Column()
  name: string;

  @Column('text')
  description: string;

  @Column({ nullable: true })
  slug: string;

  @Column('boolean', { default: true })
  isAvailable: boolean;

  @Column('int', { nullable: true })
  stock: number;

  @ManyToOne(() => Category, (category) => category.products, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  category: Category;

  @Column()
  categoryId: number;

  // Each product belongs to one collection
  @ManyToOne(() => Collection, (collection) => collection.products, {
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
    nullable: true,
  })
  collection: Collection;

  @Column({ nullable: true })
  collectionId: number;

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

  @OneToMany(() => Wishlist, (wishlist) => wishlist.product, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  wishlists: Wishlist[];

  @OneToMany(() => Variant, (variant) => variant.product, {
    cascade: true,
  })
  variants: Variant[];

  @Column({ nullable: true })
  uploadId: number;

  @Column('boolean', { default: false })
  isDeleted: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => UserReview, (review) => review.product, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  reviews: UserReview[];
}
