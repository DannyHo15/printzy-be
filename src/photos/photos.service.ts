import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import mapQueryToFindOptions from '@utils/map-query-to-find-options';
import { CreatePhotoDto } from './dto/create-photo.dto';
import { FindPhotoDto } from './dto/find-photo.dto';
import { UpdatePhotoDto } from './dto/update-photo.dto';
import { Photo } from './entities/photo.entity';

@Injectable()
export class PhotosService {
  constructor(
    @InjectRepository(Photo) private photosRepository: Repository<Photo>,
  ) {}

  public async create(createPhotoDto: CreatePhotoDto) {
    return this.photosRepository.save(createPhotoDto);
  }

  public async createMany(createPhotoDtos: CreatePhotoDto[]) {
    if (createPhotoDtos.length === 0) {
      return [];
    }

    const productId = createPhotoDtos[0].productId;

    // Delete existing photos with the specified productId
    await this.photosRepository.delete({ productId });

    const newPhotos = [];

    for (const dto of createPhotoDtos) {
      const { productId, uploadId } = dto;

      const existingPhoto = await this.photosRepository.findOne({
        where: { productId, uploadId },
      });

      if (!existingPhoto) {
        newPhotos.push(dto);
      }
    }

    return this.photosRepository.save(newPhotos);
  }

  public async findAll(query: FindPhotoDto) {
    const findOptions = mapQueryToFindOptions(query);

    const [data, total] = await this.photosRepository.findAndCount(findOptions);

    return {
      $limit: findOptions.take,
      $skip: findOptions.skip,
      total,
      data,
    };
  }

  public async findOne(id: number) {
    const photo = await this.photosRepository.findOne({
      where: { id },
    });

    if (!photo) {
      throw new UnprocessableEntityException('Photo is not found');
    }

    return photo;
  }

  public async update(id: number, updatePhotoDto: UpdatePhotoDto) {
    const photo = await this.photosRepository.findOne({
      where: { id },
    });

    if (!photo) {
      throw new UnprocessableEntityException('Photo is not found');
    }

    const updatedPhoto = await this.photosRepository.save({
      id,
      ...updatePhotoDto,
    });

    return updatedPhoto;
  }

  public async remove(id: number) {
    const photo = await this.findOne(id);

    await this.photosRepository.delete(id);

    return photo;
  }
}
