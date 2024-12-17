import { Test, TestingModule } from '@nestjs/testing';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';

describe('ProductsController - findOneBySKU', () => {
  let controller: ProductsController;
  let service: ProductsService;

  // Mock ProductsService
  const mockProductsService = {
    findOneBySKU: jest.fn(),
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

  it('should call findOneBySKU with the correct SKU and return the product', async () => {
    // Arrange
    const sku = 'SKU12345';
    const result = { id: 1, name: 'Product A', sku: 'SKU12345', price: 200 };

    // Mock service response
    mockProductsService.findOneBySKU.mockResolvedValue(result);

    // Act
    const response = await controller.findOneBySKU(sku);

    // Assert
    expect(service.findOneBySKU).toHaveBeenCalledWith(sku);
    expect(response).toEqual(result);
  });

  it('should throw an error if findOneBySKU fails', async () => {
    // Arrange
    const sku = 'SKU12345';
    const error = new Error('Product not found');

    mockProductsService.findOneBySKU.mockRejectedValue(error);

    // Act & Assert
    await expect(controller.findOneBySKU(sku)).rejects.toThrow(
      'Product not found',
    );
    expect(service.findOneBySKU).toHaveBeenCalledWith(sku);
  });
});
