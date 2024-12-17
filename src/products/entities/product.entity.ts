import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { Wishlist } from '@app/wishlists/entities/wishlists.entity';
import { UserReview } from '@app/reviews/entities/review.entity';
import { Variant } from '@app/variants/entities/variant.entity';
import { Collection } from '@app/collections/entities/collection.entity';
import { ProductOption } from './product-option.entity';
import { CategoryProduct } from './category-product.entity';
import { Upload } from '@app/uploads/entities/upload.entity';
import { Photo } from '@app/photos/entities/photo.entity';

@Entity({ name: 'products' })
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('decimal', { precision: 30, scale: 2 })
  price: number;

  @Column('int', { nullable: true, default: 0 })
  discountPercent: number;

  @Column({ length: 100, nullable: false, default: '' })
  name: string;

  @Column('text')
  description: string;

  @Column({ nullable: true })
  slug: string;

  @Column({ unique: true })
  sku: string;

  @Column('boolean', { default: true })
  isAvailable: boolean;

  @OneToMany(
    () => CategoryProduct,
    (categoryProduct) => categoryProduct.product,
  )
  categoryProducts: CategoryProduct[];

  // Each product belongs to one collection
  @ManyToOne(() => Collection, (collection) => collection.products, {
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
    nullable: true,
  })
  collection: Collection;

  @Column({ nullable: true })
  collectionId: number;

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

  // One-to-Many relationship with ProductOption
  @OneToMany(() => ProductOption, (productOption) => productOption.product, {
    cascade: true,
  })
  productOptions: ProductOption[];
}
