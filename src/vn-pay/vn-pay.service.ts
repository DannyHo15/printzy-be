import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  Purchase,
  PurchaseStatus,
} from '@app/purchases/entities/purchase.entity';

@Injectable()
export class VNPayService {
  constructor(
    @InjectRepository(Purchase)
    private readonly purchaseRepository: Repository<Purchase>,
  ) {}

  validateSecureHash(params: any, secureHash: string): boolean {
    const sortedParams = Object.keys(params)
      .sort()
      .reduce((obj, key) => {
        obj[key] = params[key];
        return obj;
      }, {});

    const signData = Object.keys(sortedParams)
      .map(
        (key) =>
          `${key}=${encodeURIComponent(sortedParams[key]).replace(/%20/g, '+')}`,
      )
      .join('&');

    const secretKey = process.env.VNP_HASHSECRET;

    const crypto = require('crypto');
    const hmac = crypto.createHmac('sha512', secretKey);
    const generatedHash = hmac
      .update(Buffer.from(signData, 'utf-8'))
      .digest('hex');

    return secureHash.toLowerCase() === generatedHash.toLowerCase();
  }

  async processTransaction(params: any, orderNumber: string) {
    const responseCode = params.vnp_ResponseCode;
    const transactionNo = params.vnp_TransactionNo;

    const purchase = await this.purchaseRepository.findOne({
      where: { order: { orderNumber } },
      relations: ['order', 'client'],
    });

    if (!purchase) {
      return {
        status: 'error',
        message: 'Purchase not found',
      };
    }
    purchase.transactionId = transactionNo;
    // Cập nhật trạng thái của Purchase
    switch (responseCode) {
      case '00':
        purchase.status = PurchaseStatus.COMPLETED;
        break;
      case '01':
      case '11':
        purchase.status = PurchaseStatus.FAILED;
        break;
      case '02':
        purchase.status = PurchaseStatus.FAILED;
        break;
      case '04':
        purchase.status = PurchaseStatus.FAILED;
        break;
      case '05':
        purchase.status = PurchaseStatus.FAILED;
        break;
      case '10':
        purchase.status = PurchaseStatus.FAILED;
        break;
      default:
        purchase.status = PurchaseStatus.FAILED;
        break;
    }

    await this.purchaseRepository.save(purchase);

    // Trả về kết quả
    return {
      status: responseCode === '00' ? 'success' : 'error',
      message:
        responseCode === '00' ? 'Transaction successful' : 'Transaction failed',
    };
  }
}
