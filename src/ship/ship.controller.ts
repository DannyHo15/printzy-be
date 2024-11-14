import { Controller, Get, Query } from '@nestjs/common';
import { Observable } from 'rxjs';
import { ShipService } from './ship.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AxiosResponse } from 'axios';
import { ShipDto } from './dto/shipping-fee.dto';

@Controller('shipping')
@ApiTags('Shipping')
export class ShipController {
  constructor(private readonly shipService: ShipService) {}

  @Get('calculate-fee')
  @ApiOperation({ summary: 'Calculate shipping fee' })
  @ApiResponse({
    status: 200,
    description: 'The found record',
    type: ShipDto,
  })
  calculateShippingFee(
    @Query('pick_province') pick_province: string,
    @Query('pick_district') pick_district: string,
    @Query('province') province: string,
    @Query('district') district: string,
    @Query('weight') weight: number,
    @Query('value') value: number,
  ): Observable<AxiosResponse<ShipDto>> {
    return this.shipService.calculateShippingFee({
      pick_province,
      pick_district,
      province,
      district,
      weight,
      value,
    });
  }
}
