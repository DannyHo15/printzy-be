import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AddressesService } from './addresses.service';
import { AddressesController } from './addresses.controller';
import { Address } from './entities/address.entity';
import { WardModule } from '@app/ward/ward.module';
import { DistrictModule } from '@app/district/district.module';
import { ProvinceModule } from '@app/province/province.module';
import { Province } from '@app/province/entities/province.entity';
import { District } from '@app/district/entities/district.entity';
import { Ward } from '@app/ward/entities/ward.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Address, Province, District, Ward])],
  controllers: [AddressesController],
  providers: [AddressesService],
})
export class AddressesModule {}
