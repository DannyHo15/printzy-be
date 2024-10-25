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
    await this.processFile('provinces.json', this.provinceRepository, 'code');
    await this.processFile('districts.json', this.districtRepository, 'code');
    await this.processFile('wards.json', this.wardRepository, 'code');
    console.log(
      'Provinces, districts, and wards have been successfully processed.',
    );
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
        console.log('==Existing Entity', existingEntity);
        console.log('Exist Value Map', existingEntitiesMap.values());

        if (existingEntity) {
          // Update existing entity
          const updateData = { ...entity } as any;
          if (fileName.includes('provinces')) {
            updateData.districts = undefined; // Exclude nested relations
          } else if (fileName.includes('districts.json')) {
            updateData.wards = undefined; // Exclude nested relations
          }
          await repository.update(existingEntity['id'], {
            ...updateData,
          } as any);
          console.log(
            `Updated entity with ${uniqueField.toString()}: ${entity[uniqueField]}`,
          );
        } else {
          // Insert new entity
          const newEntity = repository.create(entity);
          await repository.save(newEntity);
          console.log(
            `Inserted new entity with ${uniqueField.toString()}: ${entity[uniqueField]}`,
          );
        }
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

        // Additional logic to update the ward with district
        if (fileName.includes('wards')) {
          const ward = entity as Ward;
          const district = await this.districtRepository.findOne({
            where: { code: ward.district_code },
          });
          if (district) {
            ward.district = district;
            await this.wardRepository.save(ward);
          }
        }
      });

      await Promise.all(operations);
    } catch (error) {
      console.log('Initial Data failed');
    }
  }
}
