import { NestFactory } from '@nestjs/core';
import { SeedModule } from './seed.module';
import { AddressSeedService } from './address/address-seed.service';

const runSeed = async () => {
  const app = await NestFactory.create(SeedModule);

  // run
  await app.get(AddressSeedService).run();
  await app.close();
};

void runSeed();
