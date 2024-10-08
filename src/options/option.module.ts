// src/options/options.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OptionsService } from './option.service';
import { OptionsController } from './option.controller';
import { Option } from './entities/option.entity';
import { OptionValue } from './entities/option-value.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Option, OptionValue])],
  controllers: [OptionsController],
  providers: [OptionsService],
  exports: [OptionsService],
})
export class OptionsModule {}
