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
    delete params.vnp_SecureHash;

    // Sắp xếp các tham số theo tên (key)
    const sortedParams = Object.keys(params)
      .sort()
      .reduce((obj, key) => {
        obj[key] = params[key];
        return obj;
      }, {});

    // Tạo chuỗi tham số theo định dạng của VNPay
    let queryString = '';
    for (const [key, value] of Object.entries(sortedParams)) {
      queryString += `${key}=${value}&`;
    }
    queryString = queryString.slice(0, -1); // Loại bỏ dấu "&" cuối cùng

    const secretKey = process.env.VNP_HASHSECRET;
    const hashData = queryString + `&vnp_SecureHashType=SHA256&${secretKey}`;

    // Tạo mã hash bằng thuật toán SHA256
    const generatedHash = crypto
      .createHash('sha256')
      .update(hashData)
      .digest('hex')
      .toLowerCase();

    // So sánh mã hash đã tạo với mã hash nhận được
    return generatedHash === secureHash.toLowerCase();
  }

  // Xử lý kết quả giao dịch và cập nhật trạng thái Purchase
  async processTransaction(params: any) {
    const responseCode = params.vnp_ResponseCode;
    const transactionNo = params.vnp_TransactionNo;

    // Tìm Purchase dựa trên transactionId (vnp_TransactionNo)
    const purchase = await this.purchaseRepository.findOne({
      where: { transactionId: transactionNo },
      relations: ['order', 'client'],
    });

    if (!purchase) {
      return {
        status: 'error',
        message: 'Purchase not found',
      };
    }

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
