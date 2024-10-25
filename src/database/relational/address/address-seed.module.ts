import { Module } from '@nestjs/common';
import { AddressSeedService } from './address-seed.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Province } from '@app/province/entities/province.entity';
import { District } from '@app/district/entities/district.entity';
import { Ward } from '@app/ward/entities/ward.entity';

@Module({
  providers: [AddressSeedService],
  imports: [TypeOrmModule.forFeature([Province, District, Ward])],
  exports: [AddressSeedService],
})
export class AddressModule {}
