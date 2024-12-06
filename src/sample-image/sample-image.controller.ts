import { Controller, Get } from '@nestjs/common';
import * as fs from 'fs';
import { join } from 'path';

@Controller('sample-images')
export class SampleImageController {
  private readonly imagesPath = join(
    __dirname,
    '..',
    '..',
    'public',
    'sample-image',
  );

  @Get()
  listImages(): string[] {
    // Read files from the sample-image directory
    return fs
      .readdirSync(this.imagesPath)
      .map((file) => `/public/sample-image/${file}`);
  }
}
