import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { SampleImageController } from './sample-image.controller';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', '..', 'public'), // Path to the public directory
      serveRoot: '/public', // The URL prefix for static assets
    }),
  ],
  controllers: [SampleImageController],
})
export class SampleImageModule {}
