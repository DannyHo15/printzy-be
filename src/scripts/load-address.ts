import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class AppService {
  constructor(private readonly httpService: HttpService) {}

  async getProvinces(): Promise<any> {
    return this.fetchAndSaveData(
      'https://provinces.open-api.vn/api/p/',
      'provinces.json',
    );
  }

  async getDistricts(): Promise<any> {
    return this.fetchAndSaveData(
      'https://provinces.open-api.vn/api/d/',
      'districts.json',
    );
  }

  async getWards(): Promise<any> {
    return this.fetchAndSaveData(
      'https://provinces.open-api.vn/api/w/',
      'wards.json',
    );
  }

  private async fetchAndSaveData(url: string, fileName: string): Promise<any> {
    const response = await firstValueFrom(this.httpService.get(url));
    const data = response.data;
    this.saveFile(fileName, data);
    return data;
  }

  private saveFile(fileName: string, data: any) {
    const filePath = path.join(__dirname, '..', 'public', fileName);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
  }
}

const appService = new AppService(new HttpService());

appService.getProvinces();
appService.getDistricts();
appService.getWards();
