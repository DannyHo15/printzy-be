import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import mapQueryToFindOptions from '@utils/map-query-to-find-options';
import { CreatePurchaseDto } from './dto/create-purchase.dto';
import { FindPurchaseDto } from './dto/find-purchase.dto';
import { UpdatePurchaseDto } from './dto/update-purchase.dto';
import { Purchase } from './entities/purchase.entity';
import { Product } from '@products/entities/product.entity';
import { Variant } from '@app/variants/entities/variant.entity';
import { CustomizeUpload } from '@app/customize-uploads/entities/customize-upload.entity';

@Injectable()
export class PurchasesService {
  constructor(
    @InjectRepository(Purchase)
    private purchasesRepository: Repository<Purchase>,

    @InjectRepository(Product)
    private productsRepository: Repository<Product>,

    @InjectRepository(Variant)
    private variantsRepository: Repository<Variant>,

    @InjectRepository(CustomizeUpload)
    private customizeUploadsRepository: Repository<CustomizeUpload>,
  ) {}

  public async create(createPurchaseDto: CreatePurchaseDto) {
    const { quantity, orderId, clientId, transactionId, productId } =
      createPurchaseDto;

    // Fetch the Product entity
    const product = await this.productsRepository.findOne({
      where: { id: productId },
    });
    if (!product) {
      throw new UnprocessableEntityException('Product not found');
    }

    const purchase = this.purchasesRepository.create({
      quantity,
      transactionId,
      order: { id: orderId },
      clientId,
    });

    // Save the purchase to the database
    return this.purchasesRepository.save(purchase);
  }

  public async findAll(query: FindPurchaseDto) {
    const findOptions = mapQueryToFindOptions(query);

    const [data, total] =
      await this.purchasesRepository.findAndCount(findOptions);

    return {
      $limit: findOptions.take,
      $skip: findOptions.skip,
      total,
      data,
    };
  }

  public async findOne(id: number) {
    const purchase = await this.purchasesRepository.findOne({
      where: { id },
    });

    if (!purchase) {
      throw new UnprocessableEntityException('Purchase not found');
    }

    return purchase;
  }

  public async update(id: number, updatePurchaseDto: UpdatePurchaseDto) {
    const purchase = await this.purchasesRepository.findOne({
      where: { id },
    });

    if (!purchase) {
      throw new UnprocessableEntityException('Purchase not found');
    }

    const updatedPurchase = await this.purchasesRepository.save({
      id,
      ...updatePurchaseDto,
    });

    return updatedPurchase;
  }

  public async remove(id: number) {
    const purchase = await this.findOne(id);

    await this.purchasesRepository.delete(id);

    return purchase;
  }
}
