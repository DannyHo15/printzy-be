import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';

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
import { CategoryProduct } from './entities/category-product.entity';
import { Category } from '@app/categories/entities/category.entity';
import generateRandomSKU from '@app/utils/sku';

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
    @InjectRepository(CategoryProduct)
    private categoryProductRepository: Repository<CategoryProduct>,
    @InjectRepository(Category)
    private categoriesRepository: Repository<Category>,
  ) {}

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
      sku: generateRandomSKU(),
      collection,
    });

    const savedProduct = await this.productsRepository.save(product);

    await this.assignCategories(createProductDto.categoryIds, savedProduct);
    await this.assignProductOptions(createProductDto.options, savedProduct);

    return savedProduct;
  }

  public async findAll(query: FindProductDto) {
    const { options, ...otherQueryParams } = query;
    const findOptions = mapQueryToFindOptions(otherQueryParams);

    findOptions.relations = [
      'collection',
      'categoryProducts.category',
      'productOptions',
      'productOptions.option',
      'productOptions.productOptionValues',
      'productOptions.productOptionValues.optionValue',
    ];

    if (options) {
      findOptions.where = {
        ...findOptions.where,
        productOptions: {
          productOptionValues: {
            optionValue: {
              id: In(
                Object.keys(options).flatMap((optionName) =>
                  options[optionName].split(',').map((id) => parseInt(id, 10)),
                ),
              ),
            },
          },
        },
      };
    }

    const [data, total] =
      await this.productsRepository.findAndCount(findOptions);

    return {
      $limit: findOptions.take,
      $skip: findOptions.skip,
      total,
      data,
    };
  }

  public async findOne(id: number) {
    const product = await this.productsRepository.findOne({
      where: { id },
      relations: [
        'collection',
        'productOptions',
        'productOptions.productOptionValues.optionValue',
      ],
    });

    if (!product) {
      throw new UnprocessableEntityException('Product is not found');
    }

    return product;
  }

  public async findOneBySlug(slug: string) {
    const product = await this.productsRepository.findOne({
      where: { slug },
      relations: [
        'collection',
        'photos.upload',
        'categoryProducts.category',
        'productOptions',
        'productOptions.option',
        'productOptions.productOptionValues',
        'productOptions.productOptionValues.optionValue',
      ],
    });

    if (!product) {
      throw new UnprocessableEntityException('Product is not found');
    }

    return product;
  }

  public async findOneBySKU(sku: string) {
    const product = await this.productsRepository.findOne({
      where: { sku },
      relations: [
        'collection',
        'photos.upload',
        'categoryProducts.category',
        'productOptions',
        'productOptions.option',
        'productOptions.productOptionValues',
        'productOptions.productOptionValues.optionValue',
      ],
    });

    if (!product) {
      throw new UnprocessableEntityException('Product is not found');
    }

    return product;
  }

  public async update(id: number, updateProductDto: UpdateProductDto) {
    const product = await this.productsRepository.findOne({
      where: { id },
    });

    if (!product) {
      throw new UnprocessableEntityException('Product is not found');
    }

    let collection = null;

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
      collection,
    });

    await this.assignProductOptions(updateProductDto.options, updatedProduct);

    return updatedProduct;
  }

  public async remove(id: number) {
    const product = await this.findOne(id);

    await this.productsRepository.save({
      id,
      isDeleted: true,
    });

    return product;
  }

  private async assignCategories(categoryIds: number[], product: Product) {
    if (categoryIds && categoryIds.length > 0) {
      for (const categoryId of categoryIds) {
        const category = await this.categoriesRepository.findOne({
          where: { id: categoryId },
        });
        if (!category) {
          throw new UnprocessableEntityException(
            `Category with ID ${categoryId} not found`,
          );
        }

        const categoryProduct = this.categoryProductRepository.create({
          product,
          category,
        });

        await this.categoryProductRepository.save(categoryProduct);
      }
    }
  }

  private async assignProductOptions(optionsDto: any[], product: Product) {
    if (optionsDto) {
      for (const optionDto of optionsDto) {
        const option = await this.optionsRepository.findOne({
          where: { id: optionDto.optionId },
        });
        if (!option) {
          throw new UnprocessableEntityException(`Option not found`);
        }

        const productOption = await this.productOptionsRepository.save(
          this.productOptionsRepository.create({
            product,
            option,
          }),
        );

        for (const optionValueId of optionDto.values) {
          const optionValue = await this.optionValuesRepository.findOne({
            where: { id: optionValueId },
          });
          if (!optionValue) {
            throw new UnprocessableEntityException(`OptionValue not found`);
          }

          const productOptionValue = this.productOptionValuesRepository.create({
            productOption,
            optionValue,
          });

          await this.productOptionValuesRepository.save(productOptionValue);
        }
      }
    }
  }
}
