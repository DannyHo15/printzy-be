import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from '@categories/entities/category.entity';

import { Collection } from './entities/collection.entity';
import { CreateCollectionDto } from './dto/create-collection.dto';

@Injectable()
export class CollectionService {
  constructor(
    @InjectRepository(Collection)
    private readonly collectionRepository: Repository<Collection>,

    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  // Method to create a new collection
  async createCollection(
    createCollectionDto: CreateCollectionDto,
  ): Promise<Collection> {
    const { name, description, categoryId } = createCollectionDto;

    // Create new collection instance
    const collection = this.collectionRepository.create({
      name,
      description,
    });

    // Check if the categoryId is provided and assign category
    if (categoryId) {
      const category = await this.categoryRepository.findOne({
        where: { id: categoryId },
      });
      if (!category) {
        throw new NotFoundException(`Category with ID ${categoryId} not found`);
      }
      collection.category = category;
    }

    // Save the collection to the database
    return this.collectionRepository.save(collection);
  }

  // Method to find all collections
  async findAllCollections(): Promise<Collection[]> {
    return this.collectionRepository.find({ relations: ['category'] });
  }
}
