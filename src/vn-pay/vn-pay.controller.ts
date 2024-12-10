import { Controller, Query, Get } from '@nestjs/common';
import { VNPayService } from './vn-pay.service';

@Controller('ipn')
export class VNPayController {
  constructor(private readonly vnPayService: VNPayService) {}

  @Get('')
  async handleIPN(@Query() queryParams: any): Promise<any> {
    const secureHash = queryParams.vnp_SecureHash;
    delete queryParams.vnp_SecureHash;

    // Xác thực mã hash
    const isValid = this.vnPayService.validateSecureHash(
      queryParams,
      secureHash,
    );

    if (!isValid) {
      return { status: 'error', message: 'Invalid SecureHash' };
    }

    const result = await this.vnPayService.processTransaction(queryParams);

    return result;
  }
}
