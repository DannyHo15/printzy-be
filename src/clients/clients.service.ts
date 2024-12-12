import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';

import mapQueryToFindOptions from '@utils/map-query-to-find-options';
import { CreateClientDto } from './dto/create-client.dto';
import { FindClientDto } from './dto/find-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { Client } from './entities/client.entity';
import { UsersService } from '@app/users/users.service';
import { TokensService } from '@app/authentication/tokens.service';
import { WEEK_MS } from '@app/utils/variables';

@Injectable()
export class ClientsService {
  constructor(
    @InjectRepository(Client) private clientsRepository: Repository<Client>,
    @InjectDataSource()
    private dataSource: DataSource,
    private readonly usersService: UsersService,
    private readonly tokensService: TokensService,
  ) {}

  public async create(createClientDto: CreateClientDto) {
    const queryRunner = this.dataSource.createQueryRunner();
    queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const client = await this.clientsRepository.save({
        ...createClientDto,
      });
      const user = await this.usersService.create(
        {
          ...createClientDto,
          role: 'client',
        },
        client,
      );

      await this.clientsRepository.update(client.id, { userId: user.id });

      await queryRunner.commitTransaction();
      return {
        user: user,
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  public async findAll(query: FindClientDto) {
    const findOptions = mapQueryToFindOptions(query);
    findOptions.relations = ['user', 'addresses'];

    const [clients, total] =
      await this.clientsRepository.findAndCount(findOptions);

    const clientData = await this.clientsRepository
      .createQueryBuilder('client')
      .leftJoin('client.orders', 'order')
      .leftJoin('client.user', 'user')
      .leftJoin('user.carts', 'cart')
      .leftJoin('cart.cartItems', 'cartItem')
      .select('client.id', 'clientId')
      .addSelect('SUM(order.total)', 'totalPaymentSum')
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
      throw new UnprocessableEntityException({
        message: 'Client is not found',
        error: 'Unprocessable Entity',
        statusCode: 422,
      });
    }

    await this.clientsRepository
      .createQueryBuilder()
      .update(Client)
      .set(updateClientDto)
      .where('id = :id', { id })
      .execute();

    const updatedClient = await this.clientsRepository.findOne({
      where: { id },
    });

    return updatedClient;
  }

  public async remove(id: number) {
    const client = await this.findOne(id);

    await this.clientsRepository.delete(id);

    return client;
  }
}
