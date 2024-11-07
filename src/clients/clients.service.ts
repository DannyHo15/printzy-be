import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import mapQueryToFindOptions from '@utils/map-query-to-find-options';
import { CreateClientDto } from './dto/create-client.dto';
import { FindClientDto } from './dto/find-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { Client } from './entities/client.entity';

@Injectable()
export class ClientsService {
  constructor(
    @InjectRepository(Client) private clientsRepository: Repository<Client>,
  ) {}

  public async create(createClientDto: CreateClientDto) {
    return this.clientsRepository.save(createClientDto);
  }

  public async findAll(query: FindClientDto) {
    const findOptions = mapQueryToFindOptions(query);
    findOptions.relations = ['user', 'addresses'];

    const [clients, total] =
      await this.clientsRepository.findAndCount(findOptions);

    // Query to get both totalPaymentSum and cartItemCount for each client
    const clientData = await this.clientsRepository
      .createQueryBuilder('client')
      .leftJoin('client.payments', 'payment')
      .leftJoin('client.user', 'user')
      .leftJoin('user.carts', 'cart')
      .leftJoin('cart.cartItems', 'cartItem')
      .select('client.id', 'clientId')
      .addSelect('SUM(payment.sum)', 'totalPaymentSum')
      .addSelect('COUNT(cartItem.id)', 'cartItemCount')
      .groupBy('client.id')
      .getRawMany();

    // Create a map for quick lookup of payment sum and cart item count
    const clientDataMap = new Map(
      clientData.map(({ clientId, totalPaymentSum, cartItemCount }) => [
        clientId,
        {
          totalPaymentSum: Number(totalPaymentSum) || 0,
          cartItemCount: Number(cartItemCount) || 0,
        },
      ]),
    );

    // Assign the aggregated values to each client
    for (const client of clients) {
      const data = clientDataMap.get(client.id) || {
        totalPaymentSum: 0,
        cartItemCount: 0,
      };
      client['totalPaymentSum'] = data.totalPaymentSum;
      client['totalCartItems'] = data.cartItemCount;
    }

    return {
      $limit: findOptions.take,
      $skip: findOptions.skip,
      total,
      data: clients,
    };
  }

  public async findOne(id: number) {
    const client = await this.clientsRepository.findOne({
      where: { id },
    });

    if (!client) {
      throw new UnprocessableEntityException('Client is not found');
    }

    return client;
  }

  public async update(id: number, updateClientDto: UpdateClientDto) {
    const client = await this.clientsRepository.findOne({
      where: { id },
    });

    if (!client) {
      throw new UnprocessableEntityException('Client is not found');
    }

    const updatedClient = await this.clientsRepository.save({
      id,
      ...updateClientDto,
    });

    return updatedClient;
  }

  public async remove(id: number) {
    const client = await this.findOne(id);

    await this.clientsRepository.delete(id);

    return client;
  }
}
