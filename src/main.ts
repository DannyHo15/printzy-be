import { NestFactory } from '@nestjs/core';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import helmet from 'helmet';
import * as bodyParser from 'body-parser';

import { AppModule } from '@app/app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.setGlobalPrefix('api');

  app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
  app.use(bodyParser.json({ limit: '50mb' }));
  app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
  app.enableCors();
  app.enableVersioning({
    type: VersioningType.URI,
  });

  app.useStaticAssets(join(__dirname, '..', 'public'), { prefix: '/api' });
  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  const documentConfig = new DocumentBuilder()
    .setTitle('Printzy')
    .setDescription('Printzy API description.')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, documentConfig);

  SwaggerModule.setup('api/docs', app, document);

  await app.listen(3020);
}
bootstrap();
