import { Test, TestingModule } from '@nestjs/testing';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { FindProductDto } from './dto/find-product.dto';

describe('ProductsController - findAll', () => {
  let controller: ProductsController;
  let service: ProductsService;

  const mockProductsService = {
    findAll: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductsController],
      providers: [
        {
          provide: ProductsService,
          useValue: mockProductsService,
        },
      ],
    }).compile();

    controller = module.get<ProductsController>(ProductsController);
    service = module.get<ProductsService>(ProductsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should call findAll with query params and return the result', async () => {
    // Arrange
    const query: FindProductDto = {
      $limit: 10,
      $skip: 0,
      price: { $gte: 100 },
      isAvailable: true,
    };

    const result = [
      { id: 1, name: 'Product A', price: 200, isAvailable: true },
      { id: 2, name: 'Product B', price: 150, isAvailable: true },
    ];

    mockProductsService.findAll.mockResolvedValue(result);

    // Act
    const response = await controller.findAll(query);

    // Assert
    expect(service.findAll).toHaveBeenCalledWith(query);
    expect(response).toEqual(result);
  });

  it('should handle empty query params', async () => {
    // Arrange
    const query: FindProductDto = {};
    const result = [];

    mockProductsService.findAll.mockResolvedValue(result);

    // Act
    const response = await controller.findAll(query);

    // Assert
    expect(service.findAll).toHaveBeenCalledWith(query);
    expect(response).toEqual(result);
  });
});
