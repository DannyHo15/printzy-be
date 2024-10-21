import { Test, TestingModule } from '@nestjs/testing';
import { JsonAddressLoaderService } from './json-address-loader.service';

describe('JsonAddressLoaderService', () => {
  let service: JsonAddressLoaderService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [JsonAddressLoaderService],
    }).compile();

    service = module.get<JsonAddressLoaderService>(JsonAddressLoaderService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
