import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { Product } from './entities/product.entity';
import { Collection } from '@appcollections/entities/collection.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Product, Collection])],
  controllers: [ProductsController],
  providers: [ProductsService],
})
export class ProductsModule {}
