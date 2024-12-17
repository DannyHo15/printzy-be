import { Test, TestingModule } from '@nestjs/testing';
import { CartController } from './cart.controller';
import { CartService } from './cart.service';
import { Reflector } from '@nestjs/core';
import { RolesGuard } from '@app/utils/guards/roles.guard';
import { JWTGuard } from '@app/authentication/jwt.guard';

describe('CartController - removeCartItem & clearCart', () => {
  let controller: CartController;
  let service: CartService;

  const mockCartService = {
    removeCartItem: jest.fn(),
    clearCart: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CartController],
      providers: [
        {
          provide: CartService,
          useValue: mockCartService,
        },
        RolesGuard,
        JWTGuard,
        Reflector,
      ],
    }).compile();

    controller = module.get<CartController>(CartController);
    service = module.get<CartService>(CartService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  /*** Test cases for removeCartItem ***/
  describe('removeCartItem', () => {
    it('should remove an item from the cart successfully', async () => {
      const userId = 1;
      const productId = 101;
      const variantId = 201;
      const req = { user: { id: userId } };
      const expectedResponse = { success: true, message: 'Item removed' };

      mockCartService.removeCartItem.mockResolvedValue(expectedResponse);

      const result = await controller.removeCartItem(req, productId, variantId);

      expect(service.removeCartItem).toHaveBeenCalledWith(
        userId,
        productId,
        variantId,
      );
      expect(result).toEqual(expectedResponse);
    });

    it('should handle missing productId or variantId', async () => {
      const userId = 2;
      const req = { user: { id: userId } };

      await expect(
        controller.removeCartItem(req, null, 202),
      ).rejects.toThrowError();

      await expect(
        controller.removeCartItem(req, 102, null),
      ).rejects.toThrowError();

      expect(service.removeCartItem).not.toHaveBeenCalled();
    });

    it('should handle non-numeric productId or variantId', async () => {
      const userId = 3;
      const req = { user: { id: userId } };

      await expect(
        controller.removeCartItem(req, 'invalid' as unknown as number, 203),
      ).rejects.toThrowError();

      await expect(
        controller.removeCartItem(req, 103, 'invalid' as unknown as number),
      ).rejects.toThrowError();

      expect(service.removeCartItem).not.toHaveBeenCalled();
    });

    it('should handle service errors gracefully', async () => {
      const userId = 4;
      const productId = 104;
      const variantId = 204;
      const req = { user: { id: userId } };
      const errorMessage = 'Failed to remove item';

      mockCartService.removeCartItem.mockRejectedValue(new Error(errorMessage));

      await expect(
        controller.removeCartItem(req, productId, variantId),
      ).rejects.toThrow(errorMessage);

      expect(service.removeCartItem).toHaveBeenCalledWith(
        userId,
        productId,
        variantId,
      );
    });
  });

  /*** Test cases for clearCart ***/
  describe('clearCart', () => {
    it('should clear the user cart successfully', async () => {
      const userId = 5;
      const req = { user: { id: userId } };
      const expectedResponse = { success: true, message: 'Cart cleared' };

      mockCartService.clearCart.mockResolvedValue(expectedResponse);

      const result = await controller.clearCart(req);

      expect(service.clearCart).toHaveBeenCalledWith(userId);
      expect(result).toEqual(expectedResponse);
    });

    it('should handle service errors gracefully when clearing cart', async () => {
      const userId = 6;
      const req = { user: { id: userId } };
      const errorMessage = 'Failed to clear cart';

      mockCartService.clearCart.mockRejectedValue(new Error(errorMessage));

      await expect(controller.clearCart(req)).rejects.toThrow(errorMessage);

      expect(service.clearCart).toHaveBeenCalledWith(userId);
    });

    it('should handle missing user ID', async () => {
      const req = { user: { id: null } };

      await expect(controller.clearCart(req)).rejects.toThrowError();

      expect(service.clearCart).not.toHaveBeenCalled();
    });
  });
});
