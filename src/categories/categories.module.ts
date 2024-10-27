import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';

import { CategoriesService } from './categories.service';
import { CategoriesController } from './categories.controller';
import { Category } from './entities/category.entity';
import { CategoryProduct } from '@app/products/entities/category-product.entity';
import { Product } from '@app/products/entities/product.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Category, CategoryProduct, Product])],
  controllers: [CategoriesController],
  providers: [CategoriesService],
})
export class CategoriesModule {}
