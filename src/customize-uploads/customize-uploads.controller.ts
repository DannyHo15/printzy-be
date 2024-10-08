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
import { unlink } from 'fs';
import { promisify } from 'util';
import { join } from 'path';
import { Express } from 'express';
import 'multer';

import { JWTGuard } from '@authentication/jwt.guard';
import { Roles } from '@utils/decorators/role.decorator';
import { RolesGuard } from '@utils/guards/roles.guard';
import { CustomizeUploadsService } from './customize-uploads.service';
import { storage } from './storage.config';
import { CreateCustomizeUploadDto } from './dto/create-customize-upload.dto';

const unlinkAsync = promisify(unlink);

@Controller('customize-uploads')
export class CustomizeUploadsController {
  constructor(
    private readonly customizeUploadsService: CustomizeUploadsService,
  ) {}

  @UseGuards(JWTGuard, RolesGuard)
  @Roles('client')
  @UseInterceptors(FileInterceptor('file', { storage }))
  @Post(':productId')
  public async create(
    @Param('productId') productId: string,
    @UploadedFile('file') file: Express.Multer.File,
  ) {
    return this.customizeUploadsService.create(
      {
        originalName: file.originalname,
        fileName: file.filename,
        path: `${process.env.API_PATH}api/files/${file.filename}`,
        internalPath: `${process.env.API_INTERNAL_PATH}api/files/${file.filename}`,
        size: String(file.size),
        mimetype: file.mimetype,
      } as CreateCustomizeUploadDto,
      +productId,
    );
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

    await unlinkAsync(
      join(__dirname, '..', '..', 'public', 'files', customizeUpload.fileName),
    );

    return this.customizeUploadsService.remove(+id);
  }
}
