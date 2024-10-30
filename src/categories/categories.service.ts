import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Product } from '@products/entities/product.entity';
import { CategoryProduct } from '@app/products/entities/category-product.entity';
import mapQueryToFindOptions from '@utils/map-query-to-find-options';
import { CreateCategoryDto } from './dto/create-category.dto';
import { FindCategoryDto } from './dto/find-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category } from './entities/category.entity';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private categoriesRepository: Repository<Category>,
    @InjectRepository(Product)
    private productsRepository: Repository<Product>,
    @InjectRepository(CategoryProduct)
    private categoryProductRepository: Repository<CategoryProduct>,
  ) {}

  public async create(createCategoryDto: CreateCategoryDto) {
    const { productIds, ...categoryData } = createCategoryDto;

    const category = this.categoriesRepository.create(categoryData);
    await this.categoriesRepository.save(category);

    if (productIds && productIds.length > 0) {
      const products = await this.productsRepository.findByIds(productIds);
      if (products.length !== productIds.length) {
        throw new UnprocessableEntityException(
          'One or more products not found',
        );
      }

      const categoryProducts = products.map((product) => {
        const categoryProduct = new CategoryProduct();
        categoryProduct.category = category;
        categoryProduct.product = product;
        return categoryProduct;
      });

      await this.categoryProductRepository.save(categoryProducts);
    }

    return category;
  }

  public async findAll(query: FindCategoryDto) {
    const isPaginationDisabled = query.disablePagination;
    delete query.disablePagination;

    const findOptions = mapQueryToFindOptions(query);

    if (isPaginationDisabled) {
      delete findOptions.take;
    }
    findOptions.where = {
      ...findOptions.where,
      isDeleted: false,
    };

    const [data, total] = await this.categoriesRepository.findAndCount({
      ...findOptions,
      relations: ['categoryProducts', 'categoryProducts.product'],
    });

    return {
      $limit: findOptions.take,
      $skip: findOptions.skip,
      total,
      data,
    };
  }

  public async findOne(id: number) {
    const category = await this.categoriesRepository.findOne({
      where: { id },
      relations: ['categoryProducts', 'categoryProducts.product'],
    });

    if (!category) {
      throw new UnprocessableEntityException('Category is not found');
    }

    return category;
  }

  public async update(id: number, updateCategoryDto: UpdateCategoryDto) {
    const category = await this.categoriesRepository.findOne({
      where: { id },
      relations: ['categoryProducts'],
    });

    if (!category) {
      throw new UnprocessableEntityException('Category is not found');
    }

    if (updateCategoryDto.productIds) {
      const products = await this.productsRepository.findByIds(
        updateCategoryDto.productIds,
      );
      if (products.length !== updateCategoryDto.productIds.length) {
        throw new UnprocessableEntityException(
          'One or more products not found',
        );
      }

      await this.categoryProductRepository.delete({ category });

      const categoryProducts = products.map((product) => {
        const categoryProduct = new CategoryProduct();
        categoryProduct.category = category;
        categoryProduct.product = product;
        return categoryProduct;
      });

      await this.categoryProductRepository.save(categoryProducts);
    }

    const updatedCategory = await this.categoriesRepository.save({
      id,
      ...updateCategoryDto,
    });

    return updatedCategory;
  }

  public async remove(id: number) {
    const category = await this.categoriesRepository.findOne({
      where: { id },
      relations: ['categoryProducts'],
    });

    if (!category) {
      throw new UnprocessableEntityException('Category is not found');
    }

    await this.categoryProductRepository.delete({ category });

    return this.categoriesRepository.save({
      ...category,
      isDeleted: true,
    });
  }
}
