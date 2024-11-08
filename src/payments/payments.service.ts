import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { format } from 'date-fns';

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
      console.log('vnpUrl', vnpUrl);
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

  public async createVnpayPaymentUrl(
    createPaymentDto: CreatePaymentDto,
    headers: any,
    connection: any,
    socket: any,
  ) {
    // Call VNPAY API to create payment URL
    let createDate = format(new Date(), 'yyyyMMddHHmmss');
    console.log(process.env);

    let ipAddr =
      headers['x-forwarded-for'] ||
      connection.remoteAddress ||
      socket.remoteAddress ||
      connection.socket.remoteAddress;
    let tmnCode = process.env.VNP_TMNCODE;
    let secretKey = process.env.VNP_HASHSECRET;
    let vnpUrl = process.env.VNP_URL;
    let returnUrl = process.env.VNP_RETURN_URL;
    let orderId = createPaymentDto.orderId;
    let amount = createPaymentDto.sum;
    const locale = 'vn';
    const currCode = 'VND';
    let vnp_Params = {};

    vnp_Params['vnp_Version'] = '2.1.0';
    vnp_Params['vnp_Command'] = 'pay';
    vnp_Params['vnp_TmnCode'] = tmnCode;
    vnp_Params['vnp_Locale'] = locale;
    vnp_Params['vnp_CurrCode'] = currCode;
    vnp_Params['vnp_TxnRef'] = orderId;
    vnp_Params['vnp_OrderInfo'] = 'Thanh toan cho ma GD:' + orderId;
    vnp_Params['vnp_OrderType'] = 'other';
    vnp_Params['vnp_Amount'] = amount * 100;
    vnp_Params['vnp_ReturnUrl'] = returnUrl;
    vnp_Params['vnp_IpAddr'] = ipAddr;
    vnp_Params['vnp_CreateDate'] = createDate;

    console.log(vnp_Params);
    vnp_Params = this.sortObject(vnp_Params);

    let querystring = require('qs');
    let signData = querystring.stringify(vnp_Params, { encode: false });
    let crypto = require('crypto');
    let signed = crypto
      .createHmac('sha512', secretKey)
      .update(new Buffer(signData, 'utf-8'))
      .digest('hex');
    vnp_Params['vnp_SecureHash'] = signed;

    vnpUrl += '?' + querystring.stringify(vnp_Params, { encode: false });

    return {
      data: {
        vnpUrl: vnpUrl,
      },
    };
  }

  sortObject(obj: object) {
    let sorted = {};
    let str = [];
    let key: string | number;
    for (key in obj) {
      if (obj.hasOwnProperty(key)) {
        str.push(encodeURIComponent(key));
      }
    }
    str.sort();
    for (key = 0; key < str.length; key++) {
      sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, '+');
    }
    console.log(sorted);
    return sorted;
  }
}
