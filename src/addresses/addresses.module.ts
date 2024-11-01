import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AddressesService } from './addresses.service';
import { AddressesController } from './addresses.controller';
import { Address } from './entities/address.entity';
import { Province } from '@app/province/entities/province.entity';
import { District } from '@app/district/entities/district.entity';
import { Ward } from '@app/ward/entities/ward.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Address, Province, District, Ward])],
  controllers: [AddressesController],
  providers: [AddressesService],
})
export class AddressesModule {}
