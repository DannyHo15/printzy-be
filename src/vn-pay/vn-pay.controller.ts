import { Controller, Query, Get } from '@nestjs/common';
import { VNPayService } from './vn-pay.service';

@Controller('ipn')
export class VNPayController {
  constructor(private readonly vnPayService: VNPayService) {}

  @Get('')
  async handleIPN(@Query() queryParams: any): Promise<any> {
    const secureHash = queryParams['vnp_SecureHash'];

    delete queryParams['vnp_SecureHash'];
    delete queryParams['vnp_SecureHashType'];

    const isValid = this.vnPayService.validateSecureHash(
      queryParams,
      secureHash,
    );

    if (!isValid) {
      return { RspCode: '97', Message: 'Invalid SecureHash' };
    }

    const orderNumber = queryParams['vnp_TxnRef'];
    await this.vnPayService.processTransaction(queryParams, orderNumber);
    const rspCode = queryParams['vnp_ResponseCode'];

    if (rspCode === '00') {
      return { RspCode: '00', Message: 'Success' };
    } else {
      return { RspCode: rspCode, Message: 'Transaction failed' };
    }
  }
}
