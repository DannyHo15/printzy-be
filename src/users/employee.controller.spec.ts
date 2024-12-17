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
  role: 'employee',
  fullName: 'John Doe',
  client: null,
  gender: 'male',
  refreshTokens: [],
  carts: [],
  wishlists: [],
  createdAt: undefined,
  updatedAt: undefined,
  reviews: [],
  isActive: true,
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
    it('should create a user with employee role', async () => {
      const dto: CreateUserDto = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        password: 'password123',
        role: 'employee',
      };

      const result = await controller.create(dto);
      expect(result).toEqual(mockUser);
      expect(service.create).toHaveBeenCalledWith(dto);
    });

    it('should fail to create a user with invalid data', async () => {
      const dto: CreateUserDto = {
        firstName: '',
        lastName: '',
        email: 'john.doe@example.com',
        password: '',
        role: 'employee',
      };

      jest
        .spyOn(service, 'create')
        .mockRejectedValue(new Error('Failed to create user'));

      try {
        await controller.create(dto);
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
        expect(error.message).toBe('Failed to create user');
      }

      expect(service.create).toHaveBeenCalledWith(dto);
    });
  });

  describe('findAll', () => {
    it('should return all users with employee role', async () => {
      const query: FindUserDto = { role: 'employee' };
      const req = { user: { role: 'employee' } };

      const result = await controller.findAll(query, req);
      expect(result).toEqual({
        $limit: 10,
        $skip: 0,
        total: 1,
        data: mockUsers,
      });
      expect(service.findAll).toHaveBeenCalledWith(query);
    });

    it('should return empty array if no users found', async () => {
      const query: FindUserDto = { role: 'employee' };
      jest.spyOn(service, 'findAll').mockResolvedValue({
        $limit: 10,
        $skip: 0,
        total: 0,
        data: [],
      });

      const req = { user: { role: 'employee' } };
      const result = await controller.findAll(query, req);
      expect(result).toEqual({
        $limit: 10,
        $skip: 0,
        total: 0,
        data: [],
      });
    });
  });

  describe('findOne', () => {
    it('should return a single user with employee role', async () => {
      const req = { user: { id: 1, role: 'employee' } };
      const result = await controller.findOne('1', req);
      expect(result).toEqual(mockUser);
      expect(service.findOne).toHaveBeenCalledWith(1);
    });

    it("should throw BadRequestException if user ID doesn't match", async () => {
      const req = { user: { id: 2, role: 'employee' } };
      await expect(controller.findOne('1', req)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw ForbiddenException if user role is not employee', async () => {
      const req = { user: { id: 1, role: 'admin' } };
      await expect(controller.findOne('1', req)).rejects.toThrow(
        ForbiddenException,
      );
    });
  });

  describe('update', () => {
    it('should update a user with employee role', async () => {
      const dto: UpdateUserDto = {
        firstName: 'Jane',
        newPassword: '',
        confirmPassword: '',
      };
      const req = { user: { id: 1, role: 'employee' } };

      const result = await controller.update('1', dto, req);
      expect(result).toEqual({ ...mockUser, firstName: 'Jane' });
      expect(service.update).toHaveBeenCalledWith(1, dto);
    });

    it('should throw ForbiddenException if user ID mismatches', async () => {
      const dto: UpdateUserDto = {
        firstName: 'Jane',
        newPassword: '',
        confirmPassword: '',
      };
      const req = { user: { id: 2, role: 'employee' } };

      await expect(controller.update('1', dto, req)).rejects.toThrow(
        ForbiddenException,
      );
    });

    it('should throw ForbiddenException if user role is not employee', async () => {
      const dto: UpdateUserDto = {
        firstName: 'Jane',
        newPassword: '',
        confirmPassword: '',
      };
      const req = { user: { id: 1, role: 'admin' } };

      await expect(controller.update('1', dto, req)).rejects.toThrow(
        ForbiddenException,
      );
    });
  });

  describe('remove', () => {
    it('should delete a user with employee role', async () => {
      const req = { user: { id: 1, role: 'employee' } };
      const result = await controller.remove('1', req);
      expect(result).toEqual(mockUser);
      expect(service.remove).toHaveBeenCalledWith(1);
    });

    it('should throw ForbiddenException if user is not authorized to delete', async () => {
      const req = { user: { id: 2, role: 'client' } };

      await expect(controller.remove('1', req)).rejects.toThrow(
        ForbiddenException,
      );
    });

    it('should throw ForbiddenException if user role is not employee', async () => {
      const req = { user: { id: 1, role: 'admin' } };

      await expect(controller.remove('1', req)).rejects.toThrow(
        ForbiddenException,
      );
    });
  });
});
