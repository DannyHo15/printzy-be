import { Controller, Get, Query } from '@nestjs/common';
import { Observable } from 'rxjs';
import { ShipService } from './ship.service';

@Controller('shipping')
export class ShipController {
  constructor(private readonly shipService: ShipService) {}

  @Get('calculate-fee')
  calculateShippingFee(
    @Query('pick_province') pick_province: string,
    @Query('pick_district') pick_district: string,
    @Query('province') province: string,
    @Query('district') district: string,
    @Query('weight') weight: number,
    @Query('value') value: number,
  ): Observable<any> {
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
