import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, Repository } from 'typeorm';

import mapQueryToFindOptions from '@utils/map-query-to-find-options';
import { CreateOrderDto } from './dto/create-order.dto';
import { FindOrderDto } from './dto/find-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Order } from './entities/order.entity';
import { Payment } from '@app/payments/entities/payment.entity';
import { Address } from '@app/addresses/entities/address.entity';
import { Client } from '@app/clients/entities/client.entity';
import { Variant } from '@app/variants/entities/variant.entity';
import { OrderItem } from './entities/orderItem.entity';
import {
  Purchase,
  PurchaseStatus,
} from '@app/purchases/entities/purchase.entity';
import { CustomizeUpload } from '@app/customize-uploads/entities/customize-upload.entity';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order) private ordersRepository: Repository<Order>,
    @InjectRepository(OrderItem)
    private orderItemsRepository: Repository<OrderItem>,
    @InjectRepository(Payment) private paymentsRepository: Repository<Payment>,
    @InjectRepository(Address) private addressesRepository: Repository<Address>,
    @InjectRepository(Client) private clientsRepository: Repository<Client>,
    @InjectRepository(Variant) private variantsRepository: Repository<Variant>,
    @InjectRepository(CustomizeUpload)
    private customizesUploadRepository: Repository<CustomizeUpload>,
    @InjectRepository(Purchase)
    private purchasesRepository: Repository<Purchase>,
  ) {}

  public async create(createOrderDto: CreateOrderDto) {
    const address = await this.addressesRepository.findOne({
      where: { id: createOrderDto.addressId },
    });
    if (!address) {
      throw new UnprocessableEntityException('Address not found');
    }

    // Validate and get payment from repository
    const payment = await this.paymentsRepository.findOne({
      where: { id: createOrderDto.paymentId },
    });
    if (!payment) {
      throw new UnprocessableEntityException('Payment method not found');
    }

    // Validate and get client (if provided) from repository
    let client = null;
    if (createOrderDto.clientId) {
      client = await this.clientsRepository.findOne({
        where: { id: createOrderDto.clientId },
      });
      if (!client) {
        throw new UnprocessableEntityException('Client not found');
      }
    }

    // Create new order
    const order = this.ordersRepository.create({
      status: createOrderDto.status,
      total: 0,
      address,
      payment,
      client,
      orderNumber: Math.random().toString(36).substr(2, 9).toUpperCase(),
    });

    // Save order (without items)
    await this.ordersRepository.save(order);

    let total = 0;
    const orderItems = [];

    // Create and add order items
    for (const itemDto of createOrderDto.orderItems) {
      const variant = await this.variantsRepository.findOne({
        where: { id: itemDto.variantId },
      });
      if (!variant) {
        throw new UnprocessableEntityException('Variant not found');
      }

      const customizeUpload = await this.customizesUploadRepository.findOne({
        where: { id: itemDto.customizeUploadId },
      });

      const orderItem = this.orderItemsRepository.create({
        order,
        variant,
        quantity: itemDto.quantity,
        unitPrice: itemDto.unitPrice,
        customizeUpload,
      });

      orderItems.push(orderItem);
      total += itemDto.unitPrice * itemDto.quantity;
    }

    await this.orderItemsRepository.save(orderItems);
    order.orderItems = orderItems;
    const purchase = this.purchasesRepository.create({
      transactionId: null,
      order,
      client,
      status: PurchaseStatus.PENDING,
      clientId: client ? client.id : null,
    });

    await this.purchasesRepository.save(purchase);

    order.total = total;
    await this.ordersRepository.save(order);

    return order;
  }

  public async findAll(query: FindOrderDto) {
    const findOptions = mapQueryToFindOptions(query);

    const [data, total] = await this.ordersRepository.findAndCount({
      ...findOptions,
      relations: [
        'address',
        'payment',
        'client.user',
        'orderItems.variant.product',
      ],
    } as FindManyOptions<Order>);

    return {
      $limit: findOptions.take,
      $skip: findOptions.skip,
      total,
      data,
    };
  }

  public async findOne(id: number) {
    const order = await this.ordersRepository.findOne({
      where: { id },
    });

    if (!order) {
      throw new UnprocessableEntityException('Order is not found');
    }

    return order;
  }

  public async update(id: number, updateOrderDto: UpdateOrderDto) {
    // Find the order to be updated
    const order = await this.ordersRepository.findOne({
      where: { id },
      relations: ['orderItems'],
    });

    if (!order) {
      throw new UnprocessableEntityException('Order not found');
    }

    // If updating status, change the status
    if (updateOrderDto.status) {
      order.status = updateOrderDto.status;
    }

    // If there are new items or changes to existing items, handle it here
    if (updateOrderDto.orderItems) {
      const orderItems = await this.orderItemsRepository.find({
        where: { order: { id } },
      });

      // Update or delete old order items if needed
      for (const itemDto of updateOrderDto.orderItems) {
        const existingItem = orderItems.find(
          (item) => item.variant.id === itemDto.variantId,
        );

        if (existingItem) {
          existingItem.quantity = itemDto.quantity;
          existingItem.unitPrice = itemDto.unitPrice;
          await this.orderItemsRepository.save(existingItem);
        } else {
          const variant = await this.variantsRepository.findOne({
            where: { id: itemDto.variantId },
          });
          if (!variant) {
            throw new UnprocessableEntityException('Variant not found');
          }
          const newOrderItem = this.orderItemsRepository.create({
            order,
            variant,
            quantity: itemDto.quantity,
            unitPrice: itemDto.unitPrice,
          });
          await this.orderItemsRepository.save(newOrderItem);
        }
      }
    }

    // Recalculate the total price
    const updatedOrderItems = await this.orderItemsRepository.find({
      where: { order: { id } },
    });
    order.total = updatedOrderItems.reduce(
      (sum, item) => sum + item.unitPrice * item.quantity,
      0,
    );
    await this.ordersRepository.save(order);

    return order;
  }

  public async remove(id: number) {
    const order = await this.findOne(id);

    await this.ordersRepository.delete(id);

    return order;
  }
}
