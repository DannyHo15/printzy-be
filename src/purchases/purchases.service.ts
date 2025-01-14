import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, FindManyOptions, Like, Repository } from 'typeorm';

import mapQueryToFindOptions from '@utils/map-query-to-find-options';
import { CreatePurchaseDto } from './dto/create-purchase.dto';
import { FindPurchaseDto } from './dto/find-purchase.dto';
import { UpdatePurchaseDto } from './dto/update-purchase.dto';
import { Purchase } from './entities/purchase.entity';
import { Product } from '@products/entities/product.entity';
import { Order } from '@app/orders/entities/order.entity';
import { OrderStatus } from '@app/utils/types/order';

@Injectable()
export class PurchasesService {
  constructor(
    @InjectRepository(Purchase)
    private purchasesRepository: Repository<Purchase>,

    @InjectRepository(Product)
    private productsRepository: Repository<Product>,

    @InjectRepository(Order)
    private ordersRepository: Repository<Order>,
  ) {}

  public async create(createPurchaseDto: CreatePurchaseDto) {
    const { orderId, clientId, transactionId, productId } = createPurchaseDto;

    // Fetch the Product entity
    const product = await this.productsRepository.findOne({
      where: { id: productId },
    });
    if (!product) {
      throw new UnprocessableEntityException('Product not found');
    }

    const purchase = this.purchasesRepository.create({
      transactionId,
      order: { id: orderId },
      clientId,
    });
    return this.purchasesRepository.save(purchase);
  }

  public async findAll(query: FindPurchaseDto) {
    const { keyword, ...otherQuery } = query;
    const findOptions = mapQueryToFindOptions(otherQuery);

    // Adding keyword filter
    if (query.keyword) {
      findOptions.where = [
        { transactionId: Like(`%${query.keyword}%`) }, // Search in transactionId
        { order: { orderNumber: Like(`%${query.keyword}%`) } }, // Search in order number (if applicable)
      ];
    }

    const [data, total] = await this.purchasesRepository.findAndCount({
      ...findOptions,
      relations: ['client.user', 'order.payment'],
    } as FindManyOptions<Purchase>);

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

  public async findOneByOrderId(orderId: number) {
    const purchase = await this.purchasesRepository.findOne({
      where: { order: { id: orderId } },
    });

    if (!purchase) {
      throw new UnprocessableEntityException('Purchase not found');
    }

    return purchase;
  }

  public async update(id: number, updatePurchaseDto: UpdatePurchaseDto) {
    const purchase = await this.purchasesRepository.findOne({
      where: { id },
      relations: ['order'],
    });

    if (!purchase) {
      throw new UnprocessableEntityException('Purchase not found');
    }
    const order = await this.ordersRepository.findOne({
      where: { id: purchase.order.id },
    });

    order.status = OrderStatus.PROCESSING;

    await this.ordersRepository.save(order);

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
