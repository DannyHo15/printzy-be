import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Collection } from './entities/collection.entity';
import { CreateCollectionDto } from './dto/create-collection.dto';

@Injectable()
export class CollectionService {
  constructor(
    @InjectRepository(Collection)
    private readonly collectionRepository: Repository<Collection>,
  ) {}

  // Method to create a new collection
  async createCollection(
    createCollectionDto: CreateCollectionDto,
  ): Promise<Collection> {
    const { name, description } = createCollectionDto;

    // Create new collection instance
    const collection = this.collectionRepository.create({
      name,
      description,
    });

    // Save the collection to the database
    return this.collectionRepository.save(collection);
  }

  // Method to find all collections
  async findAllCollections(): Promise<Collection[]> {
    return this.collectionRepository.find();
  }
}
