import { Controller, Post, Body, Get, UseGuards } from '@nestjs/common';
import { CollectionService } from './collections.service';
import { CreateCollectionDto } from './dto/create-collection.dto';
import { Collection } from './entities/collection.entity';
import { ApiTags } from '@nestjs/swagger';
import { JWTGuard } from '@app/authentication/jwt.guard';
import { Roles } from '@app/utils/decorators/role.decorator';
import { RolesGuard } from '@app/utils/guards/roles.guard';

@Controller('collections')
@ApiTags('collections')
export class CollectionController {
  constructor(private readonly collectionService: CollectionService) {}

  @UseGuards(JWTGuard, RolesGuard)
  @Roles('admin', 'employee')
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
