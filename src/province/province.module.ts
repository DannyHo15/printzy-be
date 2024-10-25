import { Module } from '@nestjs/common';
import { ProvinceService } from './province.service';
import { ProvinceController } from './province.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Province } from './entities/province.entity';

@Module({
  controllers: [ProvinceController],
  providers: [ProvinceService],
  imports: [TypeOrmModule.forFeature([Province])],
})
export class ProvinceModule {}
