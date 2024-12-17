import { Test, TestingModule } from '@nestjs/testing';
import { CartController } from './cart.controller';
import { CartService } from './cart.service';
import { AddToCartDto } from './dto/add-to-cart.dto';

describe('CartController - addToCart', () => {
  let controller: CartController;
  let service: CartService;

  const mockCartService = {
    addToCart: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CartController],
      providers: [
        {
          provide: CartService,
          useValue: mockCartService,
        },
      ],
    }).compile();

    controller = module.get<CartController>(CartController);
    service = module.get<CartService>(CartService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should add an item with all fields correctly', async () => {
    const userId = 1;
    const req = { user: { id: userId } };
    const addToCartDto: AddToCartDto = {
      productId: 101,
      quantity: 2,
      customizeUploadId: 201,
      customizePrintId: 301,
      variantId: 401,
    };
    const expectedResponse = { success: true, message: 'Item added' };

    mockCartService.addToCart.mockResolvedValue(expectedResponse);

    const result = await controller.addToCart(req, addToCartDto);

    expect(service.addToCart).toHaveBeenCalledWith(
      userId,
      101,
      2,
      201,
      301,
      401,
    );
    expect(result).toEqual(expectedResponse);
  });

  it('should add an item when `customizePrintId` is null', async () => {
    const userId = 2;
    const req = { user: { id: userId } };
    const addToCartDto: AddToCartDto = {
      productId: 102,
      quantity: 1,
      customizeUploadId: 202,
      customizePrintId: null,
      variantId: 402,
    };
    const expectedResponse = {
      success: true,
      message: 'Item added with null customizePrintId',
    };

    mockCartService.addToCart.mockResolvedValue(expectedResponse);

    const result = await controller.addToCart(req, addToCartDto);

    expect(service.addToCart).toHaveBeenCalledWith(
      userId,
      102,
      1,
      202,
      null,
      402,
    );
    expect(result).toEqual(expectedResponse);
  });

  it('should add an item without `variantId`', async () => {
    const userId = 3;
    const req = { user: { id: userId } };
    const addToCartDto: AddToCartDto = {
      productId: 103,
      quantity: 3,
      customizeUploadId: 203,
      customizePrintId: 303,
    };
    const expectedResponse = {
      success: true,
      message: 'Item added without variantId',
    };

    mockCartService.addToCart.mockResolvedValue(expectedResponse);

    const result = await controller.addToCart(req, addToCartDto);

    expect(service.addToCart).toHaveBeenCalledWith(
      userId,
      103,
      3,
      203,
      303,
      undefined,
    );
    expect(result).toEqual(expectedResponse);
  });

  it('should return an error if `productId` is missing', async () => {
    const userId = 4;
    const req = { user: { id: userId } };
    const addToCartDto: Partial<AddToCartDto> = {
      quantity: 2,
      customizeUploadId: 204,
    };

    await expect(
      controller.addToCart(req, addToCartDto as AddToCartDto),
    ).rejects.toThrowError();
    expect(service.addToCart).not.toHaveBeenCalled();
  });

  it('should return an error if `quantity` is not positive', async () => {
    const userId = 5;
    const req = { user: { id: userId } };
    const addToCartDto: AddToCartDto = {
      productId: 105,
      quantity: -1, // Invalid
      customizeUploadId: 205,
      customizePrintId: 305,
      variantId: 405,
    };

    await expect(
      controller.addToCart(req, addToCartDto),
    ).rejects.toThrowError();
    expect(service.addToCart).not.toHaveBeenCalled();
  });

  it('should handle service errors gracefully', async () => {
    const userId = 6;
    const req = { user: { id: userId } };
    const addToCartDto: AddToCartDto = {
      productId: 106,
      quantity: 2,
      customizeUploadId: 206,
      customizePrintId: 306,
      variantId: 406,
    };

    const errorMessage = 'Service failed to add item';
    mockCartService.addToCart.mockRejectedValue(new Error(errorMessage));

    await expect(controller.addToCart(req, addToCartDto)).rejects.toThrow(
      errorMessage,
    );
    expect(service.addToCart).toHaveBeenCalledWith(
      userId,
      106,
      2,
      206,
      306,
      406,
    );
  });
});
