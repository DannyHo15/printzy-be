// src/ship/ship.service.ts
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { map, catchError } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { AxiosResponse } from 'axios';

@Injectable()
export class ShipService {
  private readonly GHTK_API_URL =
    'https://services.giaohangtietkiem.vn/services/shipment/fee';
  // 'https://services.ghtklab.com/services/shipment/fee';

  constructor(private readonly httpService: HttpService) {}

  calculateShippingFee(params: {
    pick_province: string;
    pick_district: string;
    province: string;
    district: string;
    weight: number;
    value: number;
  }): Observable<AxiosResponse<any>> {
    const headers = {
      Token: '4AwTGONpejOFkXgk6cgKiUwvLYN6SkeUZIgJOF',
      'X-Client-Source': 'S22769459',
    };

    return this.httpService.get(this.GHTK_API_URL, { headers, params }).pipe(
      map((response) => response.data),
      catchError((error) => {
        throw new HttpException(
          error.response?.data || 'Could not fetch shipping fee',
          error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }),
    );
  }
}
