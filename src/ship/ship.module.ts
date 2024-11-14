// src/ship/ship.module.ts
import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ShipService } from './ship.service';
import { ShipController } from './ship.controller';

@Module({
  imports: [HttpModule],
  controllers: [ShipController],
  providers: [ShipService],
})
export class ShipModule {}
