import {
  Controller,
  Get,
  Post,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  UseGuards,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { join } from 'path';
import 'multer';

import { JWTGuard } from '@authentication/jwt.guard';
import { Roles } from '@utils/decorators/role.decorator';
import { RolesGuard } from '@utils/guards/roles.guard';
import { CustomizeUploadsService } from './customize-uploads.service';
import { FirebaseStorageService } from '@app/uploads/firebase-storage.service';

@Controller('customize-uploads')
export class CustomizeUploadsController {
  constructor(
    private readonly customizeUploadsService: CustomizeUploadsService,
    private readonly firebaseStorageService: FirebaseStorageService,
  ) {}

  @UseGuards(JWTGuard, RolesGuard)
  @Roles('client')
  @UseInterceptors(FileInterceptor('file'))
  @Post()
  public async create(@UploadedFile('file') file) {
    const fileUrl = await this.firebaseStorageService.uploadFile(file);

    return this.customizeUploadsService.create({
      originalName: file.originalname,
      fileName: file.originalname,
      path: fileUrl,
      internalPath: fileUrl,
      size: String(file.size),
      mimetype: file.mimetype,
    });
  }

  @Get(':id')
  public async findOne(@Param('id') id: string) {
    return this.customizeUploadsService.findOne(+id);
  }

  @UseGuards(JWTGuard, RolesGuard)
  @Roles('client')
  @Delete(':id')
  public async remove(@Param('id') id: string) {
    const customizeUpload = await this.findOne(id);
    return this.customizeUploadsService.remove(+id);
  }
}
