import { Test, TestingModule } from '@nestjs/testing';
import { CategoriesController } from './categories.controller';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { FindCategoryDto } from './dto/find-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { JWTGuard } from '@authentication/jwt.guard';
import { RolesGuard } from '@utils/guards/roles.guard';

jest.mock('@authentication/jwt.guard');
jest.mock('@utils/guards/roles.guard');
jest.mock('./categories.service');

describe('CategoriesController', () => {
  let controller: CategoriesController;
  let service: CategoriesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CategoriesController],
      providers: [
        {
          provide: CategoriesService,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<CategoriesController>(CategoriesController);
    service = module.get<CategoriesService>(CategoriesService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
  it('should create a category successfully', async () => {
    const createCategoryDto: CreateCategoryDto = {
      name: 'Category 1',
      description: 'Description of Category 1',
      uploadId: 1,
      productIds: [1, 2, 3],
    };

    const result = { id: 1, ...createCategoryDto };

    service.create = jest.fn().mockResolvedValue(result);

    const response = await controller.create(createCategoryDto);
    expect(response).toEqual(result);
    expect(service.create).toHaveBeenCalledWith(createCategoryDto);
  });

  it('should return error if category creation fails', async () => {
    const createCategoryDto: CreateCategoryDto = {
      name: 'Category 1',
      description: 'Description of Category 1',
    };

    service.create = jest
      .fn()
      .mockRejectedValue(new Error('Failed to create category'));

    try {
      await controller.create(createCategoryDto);
    } catch (e) {
      expect(e.response.message).toBe('Failed to create category');
    }
  });
  it('should find all categories successfully', async () => {
    const query: FindCategoryDto = { $limit: 10, $skip: 0 };
    const result = [
      { id: 1, name: 'Category 1', description: 'Description 1' },
      { id: 2, name: 'Category 2', description: 'Description 2' },
    ];

    service.findAll = jest.fn().mockResolvedValue(result);

    const response = await controller.findAll(query);
    expect(response).toEqual(result);
    expect(service.findAll).toHaveBeenCalledWith(query);
  });

  it('should return empty array if no categories found', async () => {
    const query: FindCategoryDto = { $limit: 10, $skip: 0 };
    const result = [];

    service.findAll = jest.fn().mockResolvedValue(result);

    const response = await controller.findAll(query);
    expect(response).toEqual(result);
  });
  it('should find a category by ID successfully', async () => {
    const id = '1';
    const result = { id: 1, name: 'Category 1', description: 'Description 1' };

    service.findOne = jest.fn().mockResolvedValue(result);

    const response = await controller.findOne(id);
    expect(response).toEqual(result);
    expect(service.findOne).toHaveBeenCalledWith(1);
  });

  it('should throw error if category not found', async () => {
    const id = '999';

    service.findOne = jest.fn().mockResolvedValue(null);

    try {
      await controller.findOne(id);
    } catch (e) {
      expect(e.response.message).toBe('Category not found');
    }
  });
  it('should update a category successfully', async () => {
    const id = '1';
    const updateCategoryDto: UpdateCategoryDto = {
      name: 'Updated Category',
      description: 'Updated Description',
    };

    const result = {
      id: 1,
      name: 'Updated Category',
      description: 'Updated Description',
    };

    service.update = jest.fn().mockResolvedValue(result);

    const response = await controller.update(id, updateCategoryDto);
    expect(response).toEqual(result);
    expect(service.update).toHaveBeenCalledWith(1, updateCategoryDto);
  });

  it('should return error if category update fails', async () => {
    const id = '1';
    const updateCategoryDto: UpdateCategoryDto = { name: 'Updated Category' };

    service.update = jest
      .fn()
      .mockRejectedValue(new Error('Failed to update category'));

    try {
      await controller.update(id, updateCategoryDto);
    } catch (e) {
      expect(e.response.message).toBe('Failed to update category');
    }
  });
  it('should remove a category successfully', async () => {
    const id = '1';
    const result = { id: 1, name: 'Category 1', description: 'Description 1' };

    service.remove = jest.fn().mockResolvedValue(result);

    const response = await controller.remove(id);
    expect(response).toEqual(result);
    expect(service.remove).toHaveBeenCalledWith(1);
  });

  it('should return error if category removal fails', async () => {
    const id = '1';

    service.remove = jest
      .fn()
      .mockRejectedValue(new Error('Failed to remove category'));

    try {
      await controller.remove(id);
    } catch (e) {
      expect(e.response.message).toBe('Failed to remove category');
    }
  });
  it('should call JWTGuard and RolesGuard on create', async () => {
    const createCategoryDto: CreateCategoryDto = {
      name: 'Category',
      description: 'Description',
    };

    service.create = jest
      .fn()
      .mockResolvedValue({ id: 1, ...createCategoryDto });

    await controller.create(createCategoryDto);
    expect(JWTGuard).toHaveBeenCalled();
    expect(RolesGuard).toHaveBeenCalled();
  });

  it('should call JWTGuard and RolesGuard on update', async () => {
    const id = '1';
    const updateCategoryDto: UpdateCategoryDto = { name: 'Updated Category' };

    service.update = jest
      .fn()
      .mockResolvedValue({ id: 1, ...updateCategoryDto });

    await controller.update(id, updateCategoryDto);
    expect(JWTGuard).toHaveBeenCalled();
    expect(RolesGuard).toHaveBeenCalled();
  });
});
