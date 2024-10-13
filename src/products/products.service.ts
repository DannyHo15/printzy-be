import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import mapQueryToFindOptions from '@utils/map-query-to-find-options';
import { CreateProductDto } from './dto/create-product.dto';
import { FindProductDto } from './dto/find-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';
import { Collection } from '@appcollections/entities/collection.entity'; // Import Collection entity

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product) private productsRepository: Repository<Product>,
    @InjectRepository(Collection)
    private collectionsRepository: Repository<Collection>, // Inject Collection repository
  ) {}

  // Create a product and optionally associate it with a collection
  public async create(createProductDto: CreateProductDto) {
    let collection = null;

    // If a collectionId is provided, find the collection
    if (createProductDto.collectionId) {
      collection = await this.collectionsRepository.findOne({
        where: { id: createProductDto.collectionId },
      });

      if (!collection) {
        throw new UnprocessableEntityException('Collection not found');
      }
    }

    // Create the product and associate it with the collection if applicable
    const product = this.productsRepository.create({
      ...createProductDto,
      collection,
    });

    return this.productsRepository.save(product);
  }

  // Fetch all products based on query parameters, with optional collections
  public async findAll(query: FindProductDto) {
    const findOptions = mapQueryToFindOptions(query);

    const [data, total] = await this.productsRepository.findAndCount({
      ...findOptions,
      relations: ['collection'], // Add collection relation
    });

    return {
      $limit: findOptions.take,
      $skip: findOptions.skip,
      total,
      data,
    };
  }

  // Fetch a single product by ID with collection relation
  public async findOne(id: number) {
    const product = await this.productsRepository.findOne({
      where: { id },
      relations: ['collection'], // Include collection
    });

    if (!product) {
      throw new UnprocessableEntityException('Product is not found');
    }

    return product;
  }

  // Fetch product by slug and SKU, including collection relation
  public async findOneBySlugAndSKU(input: string) {
    const lastHyphenIndex = input.lastIndexOf('-');
    const slug = input.substring(0, lastHyphenIndex);
    const sku = input.substring(lastHyphenIndex + 1);

    const product = await this.productsRepository.findOne({
      where: { slug, sku },
      relations: ['photos.upload', 'collection'], // Add collection relation
    });

    if (!product) {
      throw new UnprocessableEntityException('Product is not found');
    }

    return product;
  }

  // Update a product and optionally associate it with a new collection
  public async update(id: number, updateProductDto: UpdateProductDto) {
    const product = await this.productsRepository.findOne({
      where: { id },
    });

    if (!product) {
      throw new UnprocessableEntityException('Product is not found');
    }

    let collection = null;

    // If collectionId is provided, fetch the collection
    if (updateProductDto.collectionId) {
      collection = await this.collectionsRepository.findOne({
        where: { id: updateProductDto.collectionId },
      });

      if (!collection) {
        throw new UnprocessableEntityException('Collection not found');
      }
    }

    const updatedProduct = await this.productsRepository.save({
      id,
      ...updateProductDto,
      collection, // Associate the collection if applicable
    });

    return updatedProduct;
  }

  // Soft delete a product by marking it as deleted
  public async remove(id: number) {
    const product = await this.findOne(id);

    await this.productsRepository.save({
      id,
      isDeleted: true,
    });

    return product;
  }
}
