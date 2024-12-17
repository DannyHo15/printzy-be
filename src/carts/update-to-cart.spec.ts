import { Test, TestingModule } from '@nestjs/testing';
import { CartController } from './cart.controller';
import { CartService } from './cart.service';
import { Reflector } from '@nestjs/core';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';
import { RolesGuard } from '@app/utils/guards/roles.guard';
import { JWTGuard } from '@app/authentication/jwt.guard';

describe('CartController - updateCartItem', () => {
  let controller: CartController;
  let service: CartService;

  const mockCartService = {
    updateCartItem: jest.fn(),
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

  /*** Test cases for updateCartItem ***/
  describe('updateCartItem', () => {
    it('should update the cart item successfully', async () => {
      const userId = 1;
      const productId = 101;
      const quantity = 3;
      const variantId = 201;
      const req = { user: { id: userId } };
      const updateCartItemDto: UpdateCartItemDto = {
        productId,
        quantity,
        variantId,
      };
      const expectedResponse = { success: true, message: 'Cart item updated' };

      mockCartService.updateCartItem.mockResolvedValue(expectedResponse);

      const result = await controller.updateCartItem(req, updateCartItemDto);

      expect(service.updateCartItem).toHaveBeenCalledWith(
        userId,
        productId,
        quantity,
        variantId,
      );
      expect(result).toEqual(expectedResponse);
    });

    it('should handle missing productId or quantity', async () => {
      const userId = 2;
      const req = { user: { id: userId } };
      const updateCartItemDtoMissingProductId: UpdateCartItemDto = {
        productId: null,
        quantity: 3,
        variantId: 202,
      };
      const updateCartItemDtoMissingQuantity: UpdateCartItemDto = {
        productId: 103,
        quantity: null,
        variantId: 203,
      };

      await expect(
        controller.updateCartItem(req, updateCartItemDtoMissingProductId),
      ).rejects.toThrowError();
      await expect(
        controller.updateCartItem(req, updateCartItemDtoMissingQuantity),
      ).rejects.toThrowError();

      expect(service.updateCartItem).not.toHaveBeenCalled();
    });

    it('should handle non-numeric productId, quantity or variantId', async () => {
      const userId = 3;
      const req = { user: { id: userId } };
      const updateCartItemDtoInvalidProductId: UpdateCartItemDto = {
        productId: 'invalid' as unknown as number,
        quantity: 3,
        variantId: 204,
      };
      const updateCartItemDtoInvalidQuantity: UpdateCartItemDto = {
        productId: 104,
        quantity: 'invalid' as unknown as number,
        variantId: 204,
      };
      const updateCartItemDtoInvalidVariantId: UpdateCartItemDto = {
        productId: 105,
        quantity: 3,
        variantId: 'invalid' as unknown as number,
      };

      await expect(
        controller.updateCartItem(req, updateCartItemDtoInvalidProductId),
      ).rejects.toThrowError();
      await expect(
        controller.updateCartItem(req, updateCartItemDtoInvalidQuantity),
      ).rejects.toThrowError();
      await expect(
        controller.updateCartItem(req, updateCartItemDtoInvalidVariantId),
      ).rejects.toThrowError();

      expect(service.updateCartItem).not.toHaveBeenCalled();
    });

    it('should handle invalid user ID', async () => {
      const req = { user: { id: null } };
      const updateCartItemDto: UpdateCartItemDto = {
        productId: 106,
        quantity: 2,
        variantId: 205,
      };

      await expect(
        controller.updateCartItem(req, updateCartItemDto),
      ).rejects.toThrowError();

      expect(service.updateCartItem).not.toHaveBeenCalled();
    });

    it('should handle service errors gracefully', async () => {
      const userId = 4;
      const productId = 107;
      const quantity = 4;
      const variantId = 206;
      const req = { user: { id: userId } };
      const updateCartItemDto: UpdateCartItemDto = {
        productId,
        quantity,
        variantId,
      };
      const errorMessage = 'Failed to update cart item';

      mockCartService.updateCartItem.mockRejectedValue(new Error(errorMessage));

      await expect(
        controller.updateCartItem(req, updateCartItemDto),
      ).rejects.toThrow(errorMessage);

      expect(service.updateCartItem).toHaveBeenCalledWith(
        userId,
        productId,
        quantity,
        variantId,
      );
    });
  });
});
