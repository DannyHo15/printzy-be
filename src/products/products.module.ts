import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { Product } from './entities/product.entity';
import { Collection } from '@app/collections/entities/collection.entity';
import { OptionValue } from '@app/options/entities/option-value.entity';
import { ProductOption } from './entities/product-option.entity';
import { ProductOptionValue } from './entities/product-option-value.entity';
import { Option } from '@app/options/entities/option.entity';

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
