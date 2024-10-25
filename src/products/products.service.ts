import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import mapQueryToFindOptions from '@utils/map-query-to-find-options';
import { CreateProductDto } from './dto/create-product.dto';
import { FindProductDto } from './dto/find-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';
import { Collection } from '@app/collections/entities/collection.entity'; // Import Collection entity
import { ProductOptionValue } from './entities/product-option-value.entity';
import { ProductOption } from './entities/product-option.entity';
import { Option } from '@app/options/entities/option.entity';
import { OptionValue } from '@app/options/entities/option-value.entity';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product) private productsRepository: Repository<Product>,
    @InjectRepository(Collection)
    private collectionsRepository: Repository<Collection>, // Inject Collection repository
    @InjectRepository(ProductOptionValue)
    private productOptionValuesRepository: Repository<ProductOptionValue>,
    @InjectRepository(ProductOption)
    private productOptionsRepository: Repository<ProductOption>,
    @InjectRepository(Option)
    private optionsRepository: Repository<Option>,
    @InjectRepository(OptionValue)
    private optionValuesRepository: Repository<OptionValue>,
  ) {}

  // Create a product and optionally associate it with a collection
  public async create(createProductDto: CreateProductDto) {
    let collection = null;

    if (createProductDto.collectionId) {
      collection = await this.collectionsRepository.findOne({
        where: { id: createProductDto.collectionId },
      });

      if (!collection) {
        throw new UnprocessableEntityException('Collection not found');
      }
    }

    const product = this.productsRepository.create({
      ...createProductDto,
      collection,
    });

    const savedProduct = await this.productsRepository.save(product);

    // Handle Product Options and Option Values
    if (createProductDto.options) {
      for (const optionDto of createProductDto.options) {
        // Create ProductOption
        const productOption = this.productOptionsRepository.create({
          product: savedProduct,
          option: await this.optionsRepository.findOne({
            where: { id: optionDto.optionId },
          }), // Assuming `optionId` is passed
        });

        const savedOption =
          await this.productOptionsRepository.save(productOption);

        // Save each option's values
        for (const optionValueDto of optionDto.values) {
          // Ensure optionValueDto contains a valid ID, fetch the corresponding OptionValue entity
          const optionValue = await this.optionValuesRepository.findOne({
            where: { id: optionValueDto }, // Assuming it's the ID of OptionValue
          });

          if (!optionValue) {
            throw new UnprocessableEntityException('OptionValue not found');
          }

          // Create ProductOptionValue
          const productOptionValue = this.productOptionValuesRepository.create({
            productOption: savedOption,
            optionValue: optionValue, // Use the actual OptionValue entity
          });

          await this.productOptionValuesRepository.save(productOptionValue);
        }
      }
    }

    return savedProduct;
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
      relations: [
        'collection',
        'productOptions',
        'productOptions.productOptionValues.optionValue',
      ], // Include collection
    });

    if (!product) {
      throw new UnprocessableEntityException('Product is not found');
    }

    return product;
  }

  // Fetch product by slug and SKU, including collection relation
  public async findOneBySlug(slug: string) {
    const product = await this.productsRepository.findOne({
      where: { slug },
      relations: [
        'category',
        'photos.upload',
        'collection',
        'productOptions.option',
        'productOptions.productOptionValues.optionValue',
      ],
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

    // Handle update of product options and option values if provided
    if (updateProductDto.options) {
      for (const optionDto of updateProductDto.options) {
        // Find existing option by optionId rather than name
        const existingOption = await this.productOptionsRepository.findOne({
          where: { product: { id }, option: { id: optionDto.optionId } },
        });

        if (existingOption) {
          // Update existing product option
          await this.productOptionsRepository.save({
            id: existingOption.id,
            product: updatedProduct,
            option: { id: optionDto.optionId },
          });

          // Handle option values update or creation
          for (const optionValueDto of optionDto.values) {
            const existingOptionValue =
              await this.productOptionValuesRepository.findOne({
                where: {
                  productOption: existingOption,
                  optionValue: { id: optionValueDto }, // Assuming option value is unique by value
                },
              });

            if (existingOptionValue) {
              // Update existing product option value
              await this.productOptionValuesRepository.save({
                id: existingOptionValue.id,
                optionValue: { id: optionValueDto },
                productOption: existingOption,
              });
            } else {
              // Create new product option value
              const newOptionValue = this.productOptionValuesRepository.create({
                productOption: existingOption,
                optionValue: { id: optionValueDto },
              });
              await this.productOptionValuesRepository.save(newOptionValue);
            }
          }
        } else {
          // Create new product option if it does not exist
          const newOption = this.productOptionsRepository.create({
            product: updatedProduct,
            option: { id: optionDto.optionId },
          });
          const savedOption =
            await this.productOptionsRepository.save(newOption);

          // Create new option values for this option
          for (const optionValueDto of optionDto.values) {
            const newOptionValue = this.productOptionValuesRepository.create({
              productOption: savedOption,
              optionValue: { id: optionValueDto },
            });
            await this.productOptionValuesRepository.save(newOptionValue);
          }
        }
      }
    }

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
