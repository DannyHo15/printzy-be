// src/options/options.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Option } from './entities/option.entity';
import { OptionValue } from './entities/option-value.entity';
import { CreateOptionDto } from './dto/create-option.dto';

@Injectable()
export class OptionsService {
  constructor(
    @InjectRepository(Option)
    private readonly optionRepository: Repository<Option>,
    @InjectRepository(OptionValue)
    private readonly optionValueRepository: Repository<OptionValue>,
  ) {}

  async create(createOptionDto: CreateOptionDto): Promise<Option> {
    const { name, values } = createOptionDto;

    const option = this.optionRepository.create({ name });
    await this.optionRepository.save(option);

    for (const value of values) {
      const optionValue = this.optionValueRepository.create({ value, option });
      await this.optionValueRepository.save(optionValue);
    }

    return option;
  }

  async findAll(): Promise<Option[]> {
    return this.optionRepository.find({ relations: ['optionValues'] });
  }
}
