import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Variant } from './entities/variant.entity';
import { VariantOptionValue } from './entities/variant-option-value.entity';
import { CreateVariantDto } from './dto/create-variant.dto';
import { UpdateVariantDto } from './dto/update-variant.dto'; // Create this DTO for updating
import { Upload } from '@appuploads/entities/upload.entity';

@Injectable()
export class VariantsService {
  constructor(
    @InjectRepository(Variant)
    private readonly variantRepository: Repository<Variant>,
    @InjectRepository(VariantOptionValue)
    private readonly variantOptionValueRepository: Repository<VariantOptionValue>,
    @InjectRepository(Upload)
    private readonly uploadRepository: Repository<Upload>,
  ) {}

  async create(
    createVariantDto: CreateVariantDto,
    productId: number,
  ): Promise<Variant> {
    let upload = null;
    if (createVariantDto.uploadId) {
      upload = await this.uploadRepository.findOne({
        where: { id: createVariantDto.uploadId },
      });
      if (!upload) {
        throw new NotFoundException(
          `Upload with ID ${createVariantDto.uploadId} not found`,
        );
      }
    }

    const variant = this.variantRepository.create({
      price: createVariantDto.price,
      stock: createVariantDto.stock,
      product: { id: productId },
      sku: createVariantDto.sku,
      upload,
    });

    await this.variantRepository.save(variant);

    for (const optionValueDto of createVariantDto.optionValues) {
      const variantOptionValue = this.variantOptionValueRepository.create({
        variant,
        optionValue: { id: optionValueDto.valueId },
      });
      await this.variantOptionValueRepository.save(variantOptionValue);
    }

    return variant;
  }

  // Get a variant by ID, including its option values and upload
  async findOne(id: number): Promise<Variant> {
    const variant = await this.variantRepository.findOne({
      where: { id },
      relations: ['variantOptionValues', 'upload', 'product'],
    });

    if (!variant) {
      throw new NotFoundException(`Variant with ID ${id} not found`);
    }

    return variant;
  }

  // Get all variants, optionally filter by productId
  async findAll(productId?: number): Promise<Variant[]> {
    const whereCondition = productId ? { product: { id: productId } } : {};
    return this.variantRepository.find({
      where: whereCondition,
      relations: ['variantOptionValues', 'upload', 'product'],
    });
  }

  // Update an existing variant and its option values
  async update(
    id: number,
    updateVariantDto: UpdateVariantDto,
  ): Promise<Variant> {
    const variant = await this.variantRepository.findOne({ where: { id } });
    if (!variant) {
      throw new NotFoundException(`Variant with ID ${id} not found`);
    }

    let upload = variant.upload;
    if (updateVariantDto.uploadId) {
      upload = await this.uploadRepository.findOne({
        where: { id: updateVariantDto.uploadId },
      });
      if (!upload) {
        throw new NotFoundException(
          `Upload with ID ${updateVariantDto.uploadId} not found`,
        );
      }
    }

    // Update the variant's basic details
    variant.price = updateVariantDto.price;
    variant.stock = updateVariantDto.stock;
    variant.sku = updateVariantDto.sku;
    variant.upload = upload;
    await this.variantRepository.save(variant);

    // Update associated option values
    if (updateVariantDto.optionValues) {
      await this.variantOptionValueRepository.delete({ variant: { id } });

      for (const optionValueDto of updateVariantDto.optionValues) {
        const variantOptionValue = this.variantOptionValueRepository.create({
          variant,
          optionValue: { id: optionValueDto.valueId },
        });
        await this.variantOptionValueRepository.save(variantOptionValue);
      }
    }

    return variant;
  }

  async remove(id: number): Promise<void> {
    const variant = await this.variantRepository.findOne({ where: { id } });
    if (!variant) {
      throw new NotFoundException(`Variant with ID ${id} not found`);
    }

    await this.variantRepository.remove(variant);
  }
}
