// src/options/options.controller.ts
import { Controller, Post, Body, Get } from '@nestjs/common';
import { OptionsService } from './option.service';
import { CreateOptionDto } from './dto/create-option.dto';

@Controller('options')
export class OptionsController {
  constructor(private readonly optionsService: OptionsService) {}

  @Post()
  async create(@Body() createOptionDto: CreateOptionDto) {
    return this.optionsService.create(createOptionDto);
  }

  @Get()
  async findAll() {
    return this.optionsService.findAll();
  }
}
