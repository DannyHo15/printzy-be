import {
  Controller,
  Get,
  Post,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  UseGuards,
  Query,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

import { JWTGuard } from '@authentication/jwt.guard';
import { Roles } from '@utils/decorators/role.decorator';
import { RolesGuard } from '@utils/guards/roles.guard';
import { FindUploadDto } from './dto/find-upload.dto';
import { UploadsService } from './uploads.service';
import { FirebaseStorageService } from './firebase-storage.service';

@Controller('uploads')
export class UploadsController {
  constructor(
    private readonly uploadsService: UploadsService,
    private readonly firebaseStorageService: FirebaseStorageService,
  ) {}

  @UseGuards(JWTGuard, RolesGuard)
  @Roles('admin', 'employee')
  @UseInterceptors(FileInterceptor('file'))
  @Post()
  public async create(@UploadedFile('file') file) {
    const fileUrl = await this.firebaseStorageService.uploadFile(file);

    return this.uploadsService.create({
      originalName: file.originalname,
      fileName: file.originalname,
      path: fileUrl,
      internalPath: fileUrl,
      size: String(file.size),
      mimetype: file.mimetype,
    });
  }

  @UseGuards(JWTGuard, RolesGuard)
  @Roles('admin', 'employee')
  @UseInterceptors(FileInterceptor('file'))
  @Post('variant-mockup')
  public async createVariantMockup(@UploadedFile('file') file) {
    const fileUrl = await this.firebaseStorageService.uploadFile(file);

    return this.uploadsService.createVariantMockup({
      originalName: file.originalname,
      fileName: file.originalname,
      path: fileUrl,
      internalPath: fileUrl,
      size: String(file.size),
      mimetype: file.mimetype,
    });
  }

  @UseGuards(JWTGuard, RolesGuard)
  @Roles('admin', 'employee')
  @UseInterceptors(FileInterceptor('file'))
  @Post('variant-design')
  public async createVariantDesign(@UploadedFile('file') file) {
    const fileUrl = await this.firebaseStorageService.uploadFile(file);

    return this.uploadsService.createVariantDesign({
      originalName: file.originalname,
      fileName: file.originalname,
      path: fileUrl,
      internalPath: fileUrl,
      size: String(file.size),
      mimetype: file.mimetype,
    });
  }

  @Get()
  public async findAll(@Query() query: FindUploadDto) {
    return this.uploadsService.findAll(query);
  }

  @Get(':id')
  public async findOne(@Param('id') id: string) {
    return this.uploadsService.findOne(+id);
  }

  @UseGuards(JWTGuard, RolesGuard)
  @Roles('admin', 'employee')
  @Delete(':id')
  public async remove(@Param('id') id: string) {
    const upload = await this.findOne(id);
    return this.uploadsService.remove(+id);
  }
}
