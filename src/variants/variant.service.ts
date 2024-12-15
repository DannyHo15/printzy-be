import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Variant } from './entities/variant.entity';
import { VariantOptionValue } from './entities/variant-option-value.entity';
import { CreateVariantDto } from './dto/create-variant.dto';
import { UpdateVariantDto } from './dto/update-variant.dto'; // Create this DTO for updating
import { Upload } from '@app/uploads/entities/upload.entity';
import { CustomizeModel } from './entities/customizeModel.entity';
import { CreateCustomizeModelDto } from './dto/create-customize-model.dto';

@Injectable()
export class VariantsService {
  constructor(
    @InjectRepository(Variant)
    private readonly variantRepository: Repository<Variant>,
    @InjectRepository(VariantOptionValue)
    private readonly variantOptionValueRepository: Repository<VariantOptionValue>,
    @InjectRepository(Upload)
    private readonly uploadRepository: Repository<Upload>,
    @InjectRepository(CustomizeModel)
    private readonly customizeModel: Repository<CustomizeModel>,
  ) {}

  async create(
    createVariantDto: CreateVariantDto,
    productId: number,
  ): Promise<Variant> {
    let upload = null;
    let customizeModel = null;
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

    if (createVariantDto.customizeModelId) {
      customizeModel = await this.customizeModel.findOne({
        where: { id: createVariantDto.customizeModelId },
      });
      if (!customizeModel) {
        throw new NotFoundException(
          `Customize
          Model with ID ${createVariantDto.customizeModelId} not found`,
        );
      }
    }

    const variant = this.variantRepository.create({
      price: createVariantDto.price,
      baseCost: createVariantDto.baseCost,
      product: { id: productId },
      sku: createVariantDto.sku,
      isAvailable: createVariantDto.isAvailable,
      isInStock: createVariantDto.isInStock,
      customizeModel,
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
      relations: ['variantOptionValues', 'upload', 'product', 'customizeModel'],
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
    variant.sku = updateVariantDto.sku;
    variant.isAvailable = updateVariantDto.isAvailable;
    variant.isInStock = updateVariantDto.isInStock;
    variant.upload = upload;
    await this.variantRepository.save(variant);

    // Update associated option values
    // if (updateVariantDto.optionValues) {
    //   await this.variantOptionValueRepository.delete({ variant: { id } });

    //   for (const optionValueDto of updateVariantDto.optionValues) {
    //     const variantOptionValue = this.variantOptionValueRepository.create({
    //       variant,
    //       optionValue: { id: optionValueDto.valueId },
    //     });
    //     await this.variantOptionValueRepository.save(variantOptionValue);
    //   }
    // }

    return variant;
  }

  async remove(id: number): Promise<void> {
    const variant = await this.variantRepository.findOne({ where: { id } });
    if (!variant) {
      throw new NotFoundException(`Variant with ID ${id} not found`);
    }

    await this.variantRepository.remove(variant);
  }

  async createCustomizeModel(createCustomizeModelDto: CreateCustomizeModelDto) {
    const customizeModel = this.customizeModel.create({
      data: createCustomizeModelDto.customizeModel,
    });
    return this.customizeModel.save(customizeModel);
  }
}
