import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { BadRequestException, ForbiddenException } from '@nestjs/common';

describe('UsersController', () => {
  let controller: UsersController;
  let service: UsersService;

  const mockUserService = {
    update: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: mockUserService,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get<UsersService>(UsersService);
  });

  describe('update isActive', () => {
    const userId = '1';
    const updateUserDto: UpdateUserDto = {
      isActive: false,
      newPassword: '',
      confirmPassword: '',
    };

    it('should allow admin to update isActive status', async () => {
      const mockAdminRequest = {
        user: { id: '2', role: 'admin' },
      };

      mockUserService.update.mockResolvedValue({
        id: userId,
        isActive: false,
      });

      const result = await controller.update(
        userId,
        updateUserDto,
        mockAdminRequest,
      );

      expect(service.update).toHaveBeenCalledWith(+userId, updateUserDto);
      expect(result).toEqual({ id: userId, isActive: false });
    });

    it('should allow user to update their own isActive status', async () => {
      const mockUserRequest = {
        user: { id: '1', role: 'client' },
      };

      mockUserService.update.mockResolvedValue({
        id: userId,
        isActive: true,
      });

      const result = await controller.update(
        userId,
        {
          isActive: true,
          newPassword: '',
          confirmPassword: '',
        },
        mockUserRequest,
      );

      expect(service.update).toHaveBeenCalledWith(+userId, { isActive: true });
      expect(result).toEqual({ id: userId, isActive: true });
    });

    it('should throw ForbiddenException when non-admin tries to update another user', async () => {
      const mockUserRequest = {
        user: { id: '3', role: 'client' },
      };

      await expect(
        controller.update(userId, updateUserDto, mockUserRequest),
      ).rejects.toThrow(ForbiddenException);

      expect(service.update).not.toHaveBeenCalled();
    });

    it('should throw BadRequestException if id does not match', async () => {
      const mockUserRequest = {
        user: { id: '2', role: 'client' },
      };

      await expect(
        controller.update('invalid-id', updateUserDto, mockUserRequest),
      ).rejects.toThrow(BadRequestException);

      expect(service.update).not.toHaveBeenCalled();
    });
  });
});
