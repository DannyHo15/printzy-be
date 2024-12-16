import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UploadsService } from './uploads.service';
import { UploadsController } from './uploads.controller';
import { Upload } from './entities/upload.entity';
import { FirebaseStorageService } from './firebase-storage.service';
import { VariantMockup } from './entities/variant-mockup.entity';
import { VariantDesign } from './entities/variant-design.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Upload, VariantMockup, VariantDesign])],
  controllers: [UploadsController],
  providers: [UploadsService, FirebaseStorageService],
  exports: [FirebaseStorageService],
})
export class UploadsModule {}
