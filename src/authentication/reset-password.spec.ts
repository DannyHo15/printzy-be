import { Test, TestingModule } from '@nestjs/testing';
import { AuthenticationController } from './authentication.controller';
import { AuthService } from './authentication.service';
import { UsersService } from '@users/users.service';
import { TokensService } from './tokens.service';

describe('AuthenticationController - resetPassword', () => {
  let controller: AuthenticationController;
  let authService: AuthService;

  const mockAuthService = {
    resetPassword: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthenticationController],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        { provide: UsersService, useValue: {} },
        { provide: TokensService, useValue: {} },
      ],
    }).compile();

    controller = module.get<AuthenticationController>(AuthenticationController);
    authService = module.get<AuthService>(AuthService);
  });

  it('should reset the password successfully', async () => {
    // Arrange
    const mockUser = { id: 'user123' };
    const mockBody = { token: 'valid_token', newPassword: 'newPassword123' };
    const mockRequest = { user: mockUser };

    // Giả lập hàm resetPassword trả về giá trị thành công
    mockAuthService.resetPassword.mockResolvedValueOnce({ success: true });

    // Act
    const result = await controller.resetPassword(mockRequest, mockBody);

    // Assert
    expect(authService.resetPassword).toHaveBeenCalledWith(
      mockUser.id,
      mockBody.newPassword,
    );
    expect(result).toEqual({ success: true });
  });

  it('should throw an error if resetPassword fails', async () => {
    // Arrange
    const mockUser = { id: 'user123' };
    const mockBody = { token: 'invalid_token', newPassword: 'newPassword123' };
    const mockRequest = { user: mockUser };

    // Giả lập hàm resetPassword throw error
    mockAuthService.resetPassword.mockRejectedValueOnce(
      new Error('Reset failed'),
    );

    // Act & Assert
    await expect(
      controller.resetPassword(mockRequest, mockBody),
    ).rejects.toThrow('Reset failed');

    expect(authService.resetPassword).toHaveBeenCalledWith(
      mockUser.id,
      mockBody.newPassword,
    );
  });
});
