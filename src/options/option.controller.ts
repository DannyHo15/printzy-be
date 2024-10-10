import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Patch,
  NotFoundException,
  HttpCode,
} from '@nestjs/common';
import { OptionsService } from './option.service';
import { CreateOptionDto } from './dto/create-option.dto';
import { UpdateOptionDto } from './dto/update-option.dto';

@Controller('options')
export class OptionsController {
  constructor(private readonly optionsService: OptionsService) {}

  // Create a new option with its values
  @Post()
  async create(@Body() createOptionDto: CreateOptionDto) {
    return this.optionsService.create(createOptionDto);
  }

  // Get all options with their values
  @Get()
  async findAll() {
    return this.optionsService.findAll();
  }

  // Get a single option by ID, including its values
  @Get(':id')
  async findOne(@Param('id') id: number) {
    const option = await this.optionsService.findOne(id);
    if (!option) {
      throw new NotFoundException(`Option with ID ${id} not found`);
    }
    return option;
  }

  // Update an option and its values
  @Patch(':id')
  async update(
    @Param('id') id: number,
    @Body() updateOptionDto: UpdateOptionDto,
  ) {
    return this.optionsService.update(id, updateOptionDto);
  }

  // Delete an option by ID
  @Delete(':id')
  @HttpCode(204) // No Content response
  async remove(@Param('id') id: number) {
    const result = await this.optionsService.remove(id);
    if (!result) {
      throw new NotFoundException(`Option with ID ${id} not found`);
    }
    return result;
  }
}
