import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { FindUserDto } from './dto/find-user.dto';
import { User } from './entities/user.entity';
import { BadRequestException, ForbiddenException } from '@nestjs/common';

// Mock data
const mockUser: User = {
  id: 1,
  firstName: 'John',
  lastName: 'Doe',
  email: 'john.doe@example.com',
  password: 'hashedPassword',
  role: 'admin',
  fullName: 'John Doe',
  client: null,
  gender: 'male',
  refreshTokens: [],
  carts: [],
  wishlists: [],
  createdAt: undefined,
  updatedAt: undefined,
  reviews: [],
  isActive: false,
};

const mockUsers: User[] = [mockUser];

// Mock Services
const mockUsersService = {
  create: jest.fn().mockResolvedValue(mockUser),
  findAll: jest.fn().mockResolvedValue({
    $limit: 10,
    $skip: 0,
    total: 1,
    data: mockUsers,
  }),
  findOne: jest.fn().mockResolvedValue(mockUser),
  update: jest.fn().mockResolvedValue({ ...mockUser, firstName: 'Jane' }),
  remove: jest.fn().mockResolvedValue(mockUser),
};

describe('UsersController', () => {
  let controller: UsersController;
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a user', async () => {
      const dto: CreateUserDto = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        password: 'password123',
        role: 'client',
      };

      const result = await controller.create(dto);
      expect(result).toEqual(mockUser);
      expect(service.create).toHaveBeenCalledWith(dto);
    });
    it('should fail to create a user when service throws an error', async () => {
      const dto: CreateUserDto = {
        firstName: '',
        lastName: '',
        email: 'john.doe@example.com',
        password: '',
        role: 'client',
      };

      // Giả lập service.create ném ra lỗi
      jest
        .spyOn(service, 'create')
        .mockRejectedValue(new Error('Failed to create user'));

      try {
        await controller.create(dto);
      } catch (error) {
        // Kiểm tra xem lỗi có đúng như mong đợi không
        expect(error).toBeInstanceOf(Error);
        expect(error.message).toBe('Failed to create user');
      }

      expect(service.create).toHaveBeenCalledWith(dto);
    });
  });

  describe('findAll', () => {
    it('should return all users', async () => {
      const query: FindUserDto = { role: 'admin' };
      const req = { user: { role: 'admin' } };

      const result = await controller.findAll(query, req);
      expect(result).toEqual({
        $limit: 10,
        $skip: 0,
        total: 1,
        data: mockUsers,
      });
      expect(service.findAll).toHaveBeenCalledWith(query);
    });
  });

  describe('findOne', () => {
    it('should return a single user', async () => {
      const req = { user: { id: 1, role: 'admin' } };
      const result = await controller.findOne('1', req);
      expect(result).toEqual(mockUser);
      expect(service.findOne).toHaveBeenCalledWith(1);
    });

    it("should throw BadRequestException if user ID doesn't match", async () => {
      const req = { user: { id: 2, role: 'client' } };
      await expect(controller.findOne('1', req)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('update', () => {
    it('should update a user', async () => {
      const dto: UpdateUserDto = {
        firstName: 'Jane',
        newPassword: '',
        confirmPassword: '',
      };
      const req = { user: { id: 1, role: 'admin' } };

      const result = await controller.update('1', dto, req);
      expect(result).toEqual({ ...mockUser, firstName: 'Jane' });
      expect(service.update).toHaveBeenCalledWith(1, dto);
    });

    it('should throw ForbiddenException if user ID is mismatched', async () => {
      const dto: UpdateUserDto = {
        firstName: 'Jane',
        newPassword: '',
        confirmPassword: '',
      };
      const req = { user: { id: 2, role: 'client' } };

      await expect(controller.update('1', dto, req)).rejects.toThrow(
        ForbiddenException,
      );
    });
  });

  describe('remove', () => {
    it('should delete a user', async () => {
      const req = { user: { id: 1, role: 'admin' } };
      const result = await controller.remove('1', req);

      expect(result).toEqual(mockUser);
      expect(service.remove).toHaveBeenCalledWith(1);
    });

    it('should throw ForbiddenException if user is not authorized', async () => {
      const req = { user: { id: 2, role: 'client' } };

      await expect(controller.remove('1', req)).rejects.toThrow(
        ForbiddenException,
      );
    });
  });
});
