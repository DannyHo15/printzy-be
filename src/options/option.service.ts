import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Option } from './entities/option.entity';
import { OptionValue } from './entities/option-value.entity';
import { CreateOptionDto } from './dto/create-option.dto';
import { UpdateOptionDto } from './dto/update-option.dto';

@Injectable()
export class OptionsService {
  constructor(
    @InjectRepository(Option)
    private readonly optionRepository: Repository<Option>,
    @InjectRepository(OptionValue)
    private readonly optionValueRepository: Repository<OptionValue>,
  ) {}

  // Create an option with associated values
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

  // Find all options with their values
  async findAll(): Promise<Option[]> {
    return this.optionRepository.find({ relations: ['optionValues'] });
  }

  // Update an option with its values
  async update(id: number, updateOptionDto: UpdateOptionDto): Promise<Option> {
    const { name, values } = updateOptionDto;
    const option = await this.optionRepository.findOne({ where: { id } });

    if (!option) {
      throw new NotFoundException(`Option with ID ${id} not found`);
    }

    // Update option name
    option.name = name;
    await this.optionRepository.save(option);

    // Update option values
    if (values) {
      await this.optionValueRepository.delete({ option }); // Remove existing values
      for (const value of values) {
        const optionValue = this.optionValueRepository.create({
          value,
          option,
        });
        await this.optionValueRepository.save(optionValue);
      }
    }

    return option;
  }

  // Delete an option by ID
  async remove(id: number): Promise<Option | null> {
    const option = await this.optionRepository.findOne({ where: { id } });

    if (!option) {
      throw new NotFoundException(`Option with ID ${id} not found`);
    }

    await this.optionRepository.remove(option);
    return option;
  }
}
