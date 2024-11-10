// src/ship/ship.module.ts
import { Module } from '@nestjs/common';
import { ShipController } from './ship.controller';
import { HttpModule } from '@nestjs/axios';
import { ShipService } from './ship.service';

@Module({
  imports: [HttpModule],
  controllers: [ShipController],
  providers: [ShipService],
})
export class ShipModule {}
