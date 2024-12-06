import { Province } from '@app/province/entities/province.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as path from 'path';
import * as fs from 'fs';
import { District } from '@app/district/entities/district.entity';
import { Ward } from '@app/ward/entities/ward.entity';
@Injectable()
export class AddressSeedService {
  constructor(
    @InjectRepository(Province)
    private provinceRepository: Repository<Province>,
    @InjectRepository(District)
    private districtRepository: Repository<District>,
    @InjectRepository(Ward)
    private wardRepository: Repository<Ward>,
  ) {}

  async run() {
    await this.processFile<Province>(
      'provinces.json',
      this.provinceRepository,
      'code',
    );
    await this.processFile<District>(
      'districts.json',
      this.districtRepository,
      'code',
    );
    await this.processFile<Ward>('wards.json', this.wardRepository, 'code');
  }

  private async processFile<T>(
    fileName: string,
    repository: Repository<T>,
    uniqueField: keyof T,
  ) {
    try {
      const filePath = path.join(__dirname, '../../../../public', fileName);
      const fileContent = await fs.promises.readFile(filePath, 'utf-8');
      const entities: T[] = JSON.parse(fileContent);

      const existingEntities = await repository.find();
      const existingEntitiesMap = new Map(
        existingEntities.map((entity) => [entity[uniqueField], entity]),
      );

      const operations = entities.map(async (entity) => {
        const existingEntity = existingEntitiesMap.get(entity[uniqueField]);

        if (existingEntity) {
          // Update existing entity
          if (fileName.includes('districts')) {
            const district = entity as District;
            const province = await this.provinceRepository.findOne({
              where: { code: district.province_code },
            });
            if (province) {
              district.province = province;
              await repository.update(existingEntity['code'], {
                ...entity,
                province,
              } as any);
            } else {
              await this.districtRepository.update(existingEntity['code'], {
                ...entity,
              } as any);
            }
          } else if (fileName.includes('wards')) {
            const ward = entity as Ward;
            const district = await this.districtRepository.findOne({
              where: { code: ward.district_code },
            });
            if (district) {
              ward.district = district;
              await repository.update(existingEntity['code'], {
                ...entity,
                district,
              } as any);
            } else {
              await repository.update(existingEntity['code'], {
                ...entity,
              } as any);
            }
          }
        } else {
          const { districts, wards, ...data } = entity as any;
          // Insert new entity
          if (fileName.includes('provinces')) {
            data.districts = undefined; // Exclude nested relations
          } else if (fileName.includes('districts.json')) {
            data.wards = undefined; // Exclude nested relations
          }
          // const newEntity = repository.create(entity);
          await repository.save(entity);
        }
      });

      await Promise.all(operations);
      await this.updateNestedRelations(fileName, entities);
    } catch (error) {
      console.log('Initial Data failed');
    }
  }

  private async updateNestedRelations<T>(fileName: string, entities: T[]) {
    for (const entity of entities) {
      if (fileName.includes('districts')) {
        const district = entity as District;
        const province = await this.provinceRepository.findOne({
          where: { code: district.province_code },
        });
        if (province) {
          district.province = province;
          await this.districtRepository.save(district);
        }
      }

      if (fileName.includes('wards')) {
        const ward = entity as Ward;
        const district = await this.districtRepository.findOne({
          where: { code: ward.district_code },
        });
        if (district) {
          ward.district = district;
          await this.wardRepository.save(ward);
        } else {
          console.log(
            `District not found for ward code: ${ward.district_code} with ${ward.name}`,
          );
        }
      }
    }
  }
}
