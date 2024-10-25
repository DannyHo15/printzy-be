import { Module } from '@nestjs/common';
import { DistrictService } from './district.service';
import { DistrictController } from './district.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { District } from './entities/district.entity';

@Module({
  controllers: [DistrictController],
  providers: [DistrictService],
  imports: [TypeOrmModule.forFeature([District])],
})
export class DistrictModule {}
