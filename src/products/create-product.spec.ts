import { Test, TestingModule } from '@nestjs/testing';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { JWTGuard } from '@authentication/jwt.guard';
import { RolesGuard } from '@utils/guards/roles.guard';
import { Roles } from '@utils/decorators/role.decorator';

jest.mock('@authentication/jwt.guard');
jest.mock('@utils/guards/roles.guard');
jest.mock('./products.service');

describe('ProductsController', () => {
  let controller: ProductsController;
  let service: ProductsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductsController],
      providers: [
        {
          provide: ProductsService,
          useValue: {
            create: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<ProductsController>(ProductsController);
    service = module.get<ProductsService>(ProductsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a product successfully', async () => {
    const createProductDto: CreateProductDto = {
      price: 100,
      name: 'Test Product',
      description: 'A test product description',
      categoryIds: [1],
    };

    const result = { id: 1, ...createProductDto };

    service.create = jest.fn().mockResolvedValue(result);

    const response = await controller.create(createProductDto);
    expect(response).toEqual(result);
    expect(service.create).toHaveBeenCalledWith(createProductDto);
  });

  it('should return an error if create fails', async () => {
    const createProductDto: CreateProductDto = {
      price: 100,
      name: 'Test Product',
      description: 'A test product description',
      categoryIds: [1],
    };

    service.create = jest
      .fn()
      .mockRejectedValue(new Error('Failed to create product'));

    try {
      await controller.create(createProductDto);
    } catch (e) {
      expect(e.response.message).toBe('Failed to create product');
    }
  });

  it('should call JWTGuard and RolesGuard on create', async () => {
    const createProductDto: CreateProductDto = {
      price: 100,
      name: 'Test Product',
      description: 'A test product description',
      categoryIds: [1],
    };

    service.create = jest.fn().mockResolvedValue({
      id: 1,
      ...createProductDto,
    });

    const jwtGuard = JWTGuard;
    const rolesGuard = RolesGuard;

    await controller.create(createProductDto);

    expect(jwtGuard).toHaveBeenCalled();
    expect(rolesGuard).toHaveBeenCalled();
  });

  it('should handle missing or invalid data', async () => {
    const createProductDto = {}; // Invalid data

    try {
      await controller.create(createProductDto as any);
    } catch (error) {
      expect(error.response.statusCode).toBe(400); // Bad Request
      expect(error.response.message).toContain('price');
      expect(error.response.message).toContain('name');
    }
  });
});
