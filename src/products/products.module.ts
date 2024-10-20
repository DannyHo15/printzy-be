import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { Product } from './entities/product.entity';
import { Collection } from '@appcollections/entities/collection.entity';
import { OptionValue } from '@appoptions/entities/option-value.entity';
import { ProductOption } from './entities/product-option.entity';
import { ProductOptionValue } from './entities/product-option-value.entity';
import { Option } from '@appoptions/entities/option.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Product,
      Collection,
      ProductOptionValue,
      ProductOption,
      Option,
      OptionValue,
    ]),
  ],
  controllers: [ProductsController],
  providers: [ProductsService],
})
export class ProductsModule {}
