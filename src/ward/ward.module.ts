import { Module } from '@nestjs/common';
import { WardService } from './ward.service';
import { WardController } from './ward.controller';
import { Ward } from './entities/ward.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  controllers: [WardController],
  providers: [WardService],
  imports: [TypeOrmModule.forFeature([Ward])],
})
export class WardModule {}
