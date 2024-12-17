import { Test, TestingModule } from '@nestjs/testing';
import { AuthenticationController } from './authentication.controller';
import { UsersService } from '@users/users.service';
import { TokensService } from './tokens.service';
import { AuthService } from './authentication.service';
import { BadRequestException } from '@nestjs/common';
import { AuthenticationDto } from './dto/authentication.dto';
import { User } from '@users/entities/user.entity';

describe('AuthenticationController', () => {
  let controller: AuthenticationController;
  let usersService: UsersService;
  let tokensService: TokensService;

  const mockUser: User = {
    id: 1,
    email: 'test@example.com',
    password: 'hashedPassword',
    firstName: '',
    lastName: '',
    role: 'admin',
    gender: 'male',
    client: null,
    refreshTokens: [],
    carts: [],
    wishlists: [],
    createdAt: undefined,
    updatedAt: undefined,
    reviews: [],
    isActive: false, // initially set as inactive
    fullName: '',
  };

  const mockAccessToken = 'mockAccessToken';
  const mockRefreshToken = 'mockRefreshToken';

  const mockUsersService = {
    findAll: jest.fn(),
    validateCredentials: jest.fn(),
  };

  const mockTokensService = {
    generateAccessToken: jest.fn(),
    generateRefreshToken: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthenticationController],
      providers: [
        { provide: UsersService, useValue: mockUsersService },
        { provide: TokensService, useValue: mockTokensService },
        { provide: AuthService, useValue: {} },
      ],
    }).compile();

    controller = module.get<AuthenticationController>(AuthenticationController);
    usersService = module.get<UsersService>(UsersService);
    tokensService = module.get<TokensService>(TokensService);
  });

  describe('create', () => {
    const dto: AuthenticationDto = {
      email: 'test@example.com',
      password: '123456',
    };

    it('should throw BadRequestException if email is missing', async () => {
      await expect(
        controller.create({ email: '', password: '123456' }),
      ).rejects.toThrow(
        new BadRequestException('Email and password are required'),
      );
    });

    it('should throw BadRequestException if password is missing', async () => {
      await expect(
        controller.create({ email: 'test@example.com', password: '' }),
      ).rejects.toThrow(
        new BadRequestException('Email and password are required'),
      );
    });

    it('should throw BadRequestException if user is inactive', async () => {
      mockUsersService.findAll.mockResolvedValueOnce({
        data: [{ ...mockUser, isActive: false }],
      });

      await expect(controller.create(dto)).rejects.toThrow(
        new BadRequestException('User account is inactive'),
      );
    });

    it('should throw an error if access token generation fails', async () => {
      mockUsersService.findAll.mockResolvedValueOnce({ data: [mockUser] });
      mockUsersService.validateCredentials.mockResolvedValueOnce(true);

      mockTokensService.generateAccessToken.mockRejectedValueOnce(
        new Error('Access Token Error'),
      );

      await expect(controller.create(dto)).rejects.toThrow(
        'Access Token Error',
      );
    });

    it('should throw an error if refresh token generation fails', async () => {
      mockUsersService.findAll.mockResolvedValueOnce({ data: [mockUser] });
      mockUsersService.validateCredentials.mockResolvedValueOnce(true);
      mockTokensService.generateAccessToken.mockResolvedValueOnce(
        mockAccessToken,
      );
      mockTokensService.generateRefreshToken.mockRejectedValueOnce(
        new Error('Refresh Token Error'),
      );

      await expect(controller.create(dto)).rejects.toThrow(
        'Refresh Token Error',
      );
    });

    it('should handle unexpected errors from UsersService', async () => {
      mockUsersService.findAll.mockRejectedValueOnce(
        new Error('Unexpected UsersService Error'),
      );

      await expect(controller.create(dto)).rejects.toThrow(
        'Unexpected UsersService Error',
      );
    });

    it('should handle unexpected errors from validateCredentials', async () => {
      mockUsersService.findAll.mockResolvedValueOnce({ data: [mockUser] });
      mockUsersService.validateCredentials.mockRejectedValueOnce(
        new Error('Unexpected Validation Error'),
      );

      await expect(controller.create(dto)).rejects.toThrow(
        'Unexpected Validation Error',
      );
    });
  });
});
