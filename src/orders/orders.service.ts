import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { InjectConnection, InjectRepository } from '@nestjs/typeorm';
import {
  Connection,
  DataSource,
  FindManyOptions,
  FindOneOptions,
  Repository,
} from 'typeorm';

import mapQueryToFindOptions from '@utils/map-query-to-find-options';
import { Product } from '@products/entities/product.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { FindOrderDto } from './dto/find-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Order } from './entities/order.entity';
import { AddressesService } from '@app/addresses/addresses.service';
import { User } from '@app/users/entities/user.entity';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order) private ordersRepository: Repository<Order>,
    @InjectConnection() private connection: Connection,
    private readonly addressesService: AddressesService,
  ) {}

  public async create(createOrderDto: CreateOrderDto, user: User) {
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    const address = await this.addressesService.findOne(
      createOrderDto.addressId,
      user,
    );
    try {
      await queryRunner.manager.save(Order, {
        ...createOrderDto,
        address: { id: address.id },
        status: createOrderDto.status,
      });
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }
  public async findAll(query: FindOrderDto) {
    const findOptions = mapQueryToFindOptions(query);

    const [data, total] = await this.ordersRepository.findAndCount({
      ...findOptions,
      relations: ['address', 'payment'],
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
    const order = await this.ordersRepository.findOne({
      where: { id },
      relations: ['purchases'],
    });

    if (!order) {
      throw new UnprocessableEntityException('Order is not found');
    }

    return new Promise((resolve) => {
      this.connection.transaction(async (entityManager) => {
        if (order.status === 'cancelled') {
          delete updateOrderDto.status;
        }

        // if (
        //   updateOrderDto.status &&
        //   order.status !== 'cancelled' &&
        //   updateOrderDto.status === 'cancelled'
        // ) {
        //   await Promise.all(
        //     order.purchase(async ({ productId }) => {
        //       return await entityManager.save(Product, {
        //         id: productId,
        //         isAvailable: true,
        //       });
        //     }),
        //   );
        // }

        resolve(
          await entityManager.save(Order, {
            id,
            ...updateOrderDto,
          }),
        );
      });
    });
  }

  public async remove(id: number) {
    const order = await this.findOne(id);

    await this.ordersRepository.delete(id);

    return order;
  }
}
