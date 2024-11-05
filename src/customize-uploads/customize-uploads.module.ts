import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomizeUpload } from './entities/customize-upload.entity';
import { CustomizeUploadsController } from './customize-uploads.controller';
import { CustomizeUploadsService } from './customize-uploads.service';
import { UploadsModule } from '@app/uploads/uploads.module';
import { FirebaseStorageService } from '@app/uploads/firebase-storage.service';

@Module({
  imports: [TypeOrmModule.forFeature([CustomizeUpload]), UploadsModule],
  controllers: [CustomizeUploadsController],
  providers: [CustomizeUploadsService, FirebaseStorageService],
})
export class CustomizeUploadsModule {}
