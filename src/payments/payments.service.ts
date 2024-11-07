import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import mapQueryToFindOptions from '@utils/map-query-to-find-options';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { FindPaymentDto } from './dto/find-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { Payment } from './entities/payment.entity';
import { VnpayService } from './vnpay.service';

@Injectable()
export class PaymentsService {
  constructor(
    @InjectRepository(Payment) private paymentsRepository: Repository<Payment>,
    private readonly vnpayService: VnpayService,
  ) {}

  public async create(createPaymentDto: CreatePaymentDto) {
    this.paymentsRepository.save(createPaymentDto);
    if (createPaymentDto.paymentMethod === 'vnpay') {
      const vnpUrl = this.vnpayService.createPaymentUrl(
        createPaymentDto.orderId.toString(),
        createPaymentDto.sum,
        `Payment for order #${createPaymentDto.orderId}`,
      );
      return { paymentUrl: vnpUrl };
    }
  }

  public async findAll(query: FindPaymentDto) {
    const findOptions = mapQueryToFindOptions(query);

    const [data, total] =
      await this.paymentsRepository.findAndCount(findOptions);

    return {
      $limit: findOptions.take,
      $skip: findOptions.skip,
      total,
      data,
    };
  }

  public async findOne(id: number) {
    const payment = await this.paymentsRepository.findOne({
      where: { id },
    });

    if (!payment) {
      throw new UnprocessableEntityException('Payment is not found');
    }

    return payment;
  }

  public async update(id: number, updatePaymentDto: UpdatePaymentDto) {
    const payment = await this.paymentsRepository.findOne({
      where: { id },
    });

    if (!payment) {
      throw new UnprocessableEntityException('Payment is not found');
    }

    const updatedPayment = await this.paymentsRepository.save({
      id,
      ...updatePaymentDto,
    });

    return updatedPayment;
  }

  public async remove(id: number) {
    const payment = await this.findOne(id);

    await this.paymentsRepository.delete(id);

    return payment;
  }
}
