import { Test, TestingModule } from '@nestjs/testing';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { UpdateProductDto } from './dto/update-product.dto';
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
            update: jest.fn(),
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

  it('should update a product successfully', async () => {
    const id = '1';
    const updateProductDto: UpdateProductDto = {
      price: 120,
      name: 'Updated Product',
      description: 'Updated description',
    };

    const result = { id: +id, ...updateProductDto };

    service.update = jest.fn().mockResolvedValue(result);

    const response = await controller.update(id, updateProductDto);
    expect(response).toEqual(result);
    expect(service.update).toHaveBeenCalledWith(+id, updateProductDto);
  });

  it('should return an error if update fails', async () => {
    const id = '1';
    const updateProductDto: UpdateProductDto = {
      price: 120,
      name: 'Updated Product',
      description: 'Updated description',
    };

    service.update = jest
      .fn()
      .mockRejectedValue(new Error('Failed to update product'));

    try {
      await controller.update(id, updateProductDto);
    } catch (e) {
      expect(e.response.message).toBe('Failed to update product');
    }
  });

  it('should call JWTGuard and RolesGuard on update', async () => {
    const id = '1';
    const updateProductDto: UpdateProductDto = {
      price: 120,
      name: 'Updated Product',
      description: 'Updated description',
    };

    service.update = jest.fn().mockResolvedValue({
      id: +id,
      ...updateProductDto,
    });

    const jwtGuard = JWTGuard;
    const rolesGuard = RolesGuard;

    await controller.update(id, updateProductDto);

    expect(jwtGuard).toHaveBeenCalled();
    expect(rolesGuard).toHaveBeenCalled();
  });

  it('should handle missing or invalid data on update', async () => {
    const id = '1';
    const updateProductDto = {}; // Invalid data

    try {
      await controller.update(id, updateProductDto as any);
    } catch (error) {
      expect(error.response.statusCode).toBe(400); // Bad Request
      expect(error.response.message).toContain('price');
      expect(error.response.message).toContain('name');
    }
  });
});
