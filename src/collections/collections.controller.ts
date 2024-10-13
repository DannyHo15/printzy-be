import { Controller, Post, Body, Get } from '@nestjs/common';
import { CollectionService } from './collections.service';
import { CreateCollectionDto } from './dto/create-collection.dto';
import { Collection } from './entities/collection.entity';

@Controller('collections')
export class CollectionController {
  constructor(private readonly collectionService: CollectionService) {}

  @Post()
  async createCollection(
    @Body() createCollectionDto: CreateCollectionDto,
  ): Promise<Collection> {
    return this.collectionService.createCollection(createCollectionDto);
  }

  @Get()
  async findAllCollections(): Promise<Collection[]> {
    return this.collectionService.findAllCollections();
  }
}
