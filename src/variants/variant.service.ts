import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Variant } from './entities/variant.entity';
import { VariantOptionValue } from './entities/variant-option-value.entity';
import { CreateVariantDto } from './dto/create-variant.dto';
import { UpdateVariantDto } from './dto/update-variant.dto';
import { Upload } from '@app/uploads/entities/upload.entity';
import { VariantMockup } from '@app/uploads/entities/variant-mockup.entity';
import { VariantDesign } from '@app/uploads/entities/variant-design.entity';

@Injectable()
export class VariantsService {
  constructor(
    @InjectRepository(Variant)
    private readonly variantRepository: Repository<Variant>,
    @InjectRepository(VariantOptionValue)
    private readonly variantOptionValueRepository: Repository<VariantOptionValue>,
    @InjectRepository(Upload)
    private readonly uploadRepository: Repository<Upload>,
    @InjectRepository(VariantMockup)
    private readonly variantMockupRepository: Repository<VariantMockup>,
    @InjectRepository(VariantDesign)
    private readonly variantDesignRepository: Repository<VariantDesign>,
  ) {}

  async create(
    createVariantDto: CreateVariantDto,
    productId: number,
  ): Promise<Variant> {
    let upload = null;
    let variantDesign = null;
    let variantMockup = null;
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

    if (createVariantDto.variantMockupId) {
      variantMockup = await this.variantMockupRepository.findOne({
        where: { id: createVariantDto.variantMockupId },
      });
      if (!upload) {
        throw new NotFoundException(
          `Variant Mockup with ID ${createVariantDto.variantMockupId} not found`,
        );
      }
    }

    if (createVariantDto.variantDesignId) {
      variantDesign = await this.variantDesignRepository.findOne({
        where: { id: createVariantDto.variantDesignId },
      });
      if (!upload) {
        throw new NotFoundException(
          `Variant Design with ID ${createVariantDto.variantDesignId} not found`,
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
      upload,
      variantMockup,
      variantDesign,
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

  async findOne(id: number): Promise<Variant> {
    const variant = await this.variantRepository.findOne({
      where: { id },
      relations: ['variantOptionValues', 'upload', 'product', 'variantDesign'],
    });

    if (!variant) {
      throw new NotFoundException(`Variant with ID ${id} not found`);
    }

    return variant;
  }

  async findAll(productId?: number): Promise<Variant[]> {
    const whereCondition = productId ? { product: { id: productId } } : {};
    return this.variantRepository.find({
      where: whereCondition,
      relations: [
        'variantOptionValues',
        'upload',
        'product',
        'variantDesign',
        'variantMockup',
      ],
    });
  }

  async update(
    id: number,
    updateVariantDto: UpdateVariantDto,
  ): Promise<Variant> {
    const variant = await this.variantRepository.findOne({ where: { id } });
    if (!variant) {
      throw new NotFoundException(`Variant with ID ${id} not found`);
    }

    variant.price = updateVariantDto.price;
    variant.sku = updateVariantDto.sku;
    variant.isAvailable = updateVariantDto.isAvailable;
    variant.isInStock = updateVariantDto.isInStock;
    await this.variantRepository.save(variant);

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
