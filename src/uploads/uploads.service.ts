import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import mapQueryToFindOptions from '@utils/map-query-to-find-options';
import { CreateUploadDto } from './dto/create-upload.dto';
import { FindUploadDto } from './dto/find-upload.dto';
import { Upload } from './entities/upload.entity';
import { VariantMockup } from './entities/variant-mockup.entity';
import { VariantDesign } from './entities/variant-design.entity';

@Injectable()
export class UploadsService {
  constructor(
    @InjectRepository(Upload) private uploadsRepository: Repository<Upload>,
    @InjectRepository(VariantMockup)
    private variantMockupsRepository: Repository<VariantMockup>,
    @InjectRepository(VariantDesign)
    private variantDesignsRepository: Repository<VariantDesign>,
  ) {}

  public async create(createUploadDto: CreateUploadDto) {
    return this.uploadsRepository.save(createUploadDto);
  }

  public async createVariantMockup(createVariantMockupDto: CreateUploadDto) {
    return this.variantMockupsRepository.save({
      ...createVariantMockupDto,
    });
  }

  public async createVariantDesign(createVariantMockupDto: CreateUploadDto) {
    return this.variantDesignsRepository.save({
      ...createVariantMockupDto,
    });
  }

  public async findAll(query: FindUploadDto) {
    const findOptions = mapQueryToFindOptions(query);

    const [data, total] =
      await this.uploadsRepository.findAndCount(findOptions);

    return {
      $limit: findOptions.take,
      $skip: findOptions.skip,
      total,
      data,
    };
  }

  public async findOne(id: number) {
    const upload = await this.uploadsRepository.findOne({
      where: { id },
    });

    if (!upload) {
      throw new UnprocessableEntityException('Upload is not found');
    }

    return upload;
  }

  public async remove(id: number) {
    const upload = await this.findOne(id);

    await this.uploadsRepository.delete(id);

    return upload;
  }
}
