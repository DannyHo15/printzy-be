import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';

@Injectable()
export class VnpayService {
  private readonly vnp_TmnCode = process.env.VNP_TMNCODE;
  private readonly vnp_HashSecret = process.env.VNP_HASHSECRET;
  private readonly vnp_Url = process.env.VNP_URL;
  private readonly vnp_ReturnUrl = process.env.VNP_RETURNURL;

  // Method to create VNPay payment URL
  createPaymentUrl(orderId: string, amount: number, orderInfo: string) {
    const params: any = {
      vnp_Version: '2.1.0',
      vnp_Command: 'pay',
      vnp_TmnCode: this.vnp_TmnCode,
      vnp_Amount: amount * 100,
      vnp_CreateDate: new Date().toISOString().slice(0, 19).replace(/-|:/g, ''),
      vnp_CurrCode: 'VND',
      vnp_IpAddr: '127.0.0.1',
      vnp_Locale: 'vn',
      vnp_OrderInfo: orderInfo,
      vnp_OrderType: 'billpayment',
      vnp_ReturnUrl: this.vnp_ReturnUrl,
      vnp_TxnRef: orderId,
    };

    const sortedParams = Object.keys(params)
      .sort()
      .reduce((result, key) => {
        result[key] = params[key];
        return result;
      }, {});

    const querystring = new URLSearchParams(sortedParams as any).toString();
    const hmac = crypto.createHmac('sha512', this.vnp_HashSecret);
    const signature = hmac.update(querystring).digest('hex');

    return `${this.vnp_Url}?${querystring}&vnp_SecureHash=${signature}`;
  }

  // Method to verify VNPay response signature
  verifyPayment(query: any): boolean {
    const vnpSecureHash = query.vnp_SecureHash;
    delete query.vnp_SecureHash; // Remove the hash from the query parameters

    const sortedParams = Object.keys(query)
      .sort()
      .reduce((result, key) => {
        result[key] = query[key];
        return result;
      }, {});

    const querystring = new URLSearchParams(sortedParams as any).toString();
    const hmac = crypto.createHmac('sha512', this.vnp_HashSecret);
    const signature = hmac.update(querystring).digest('hex');

    return vnpSecureHash === signature;
  }

  // Method to handle the return URL from VNPay
  handleReturn(query: any) {
    const isValid = this.verifyPayment(query);
    if (!isValid) {
      throw new Error('Invalid VNPay signature');
    }

    // Extract other parameters you need from query
    const paymentStatus =
      query.vnp_ResponseCode === '00' ? 'Success' : 'Failure';
    const transactionId = query.vnp_TransactionNo;
    const orderId = query.vnp_TxnRef;

    return {
      status: paymentStatus,
      transactionId,
      orderId,
    };
  }
}
