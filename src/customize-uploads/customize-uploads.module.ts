import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MulterModule } from '@nestjs/platform-express';
import { join } from 'path';
import { CustomizeUpload } from './entities/customize-upload.entity';
import { CustomizeUploadsController } from './customize-uploads.controller';
import { CustomizeUploadsService } from './customize-uploads.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([CustomizeUpload]),
    MulterModule.register({
      dest: join(__dirname, '..', '..', 'public', 'files'),
    }),
  ],
  controllers: [CustomizeUploadsController],
  providers: [CustomizeUploadsService],
})
export class CustomizeUploadsModule {}
