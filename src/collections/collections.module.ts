import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from '@categories/entities/category.entity';
import { Collection } from './entities/collection.entity';
import { CollectionController } from './collections.controller';
import { CollectionService } from './collections.service';

@Module({
  imports: [TypeOrmModule.forFeature([Collection, Category])],
  controllers: [CollectionController],
  providers: [CollectionService],
})
export class CollectionModule {}
