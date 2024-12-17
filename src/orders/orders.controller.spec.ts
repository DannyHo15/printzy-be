import { Test, TestingModule } from '@nestjs/testing';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { ForbiddenException } from '@nestjs/common';
import { JWTGuard } from '@authentication/jwt.guard';
import { RolesGuard } from '@utils/guards/roles.guard';
import { Roles } from '@utils/decorators/role.decorator';
import { OrderStatus } from '@app/utils/types/order';

describe('OrdersController', () => {
  let ordersController: OrdersController;
  let ordersService: OrdersService;

  const mockOrdersService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  const mockUser = { role: 'client', client: { id: 1 } };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrdersController],
      providers: [
        {
          provide: OrdersService,
          useValue: mockOrdersService,
        },
      ],
    })
      .overrideGuard(JWTGuard)
      .useValue({ canActivate: jest.fn(() => true) })
      .overrideGuard(RolesGuard)
      .useValue({ canActivate: jest.fn(() => true) })
      .compile();

    ordersController = module.get<OrdersController>(OrdersController);
    ordersService = module.get<OrdersService>(OrdersService);
  });

  describe('create', () => {
    it('should create a new order successfully', async () => {
      const createOrderDto: CreateOrderDto = {
        addressId: 1,
        paymentId: 1,
        shippingFee: 100,
        orderItems: [
          {
            variantId: 1,
            quantity: 2,
            unitPrice: 100,
            customizeUploadId: 1,
            customizePrintId: 1,
          },
        ],
        clientId: 0,
      };

      mockOrdersService.create.mockResolvedValue({ id: 1, ...createOrderDto });
      const result = await ordersController.create(createOrderDto, {
        user: mockUser,
      });

      expect(result).toEqual({ id: 1, ...createOrderDto });
      expect(mockOrdersService.create).toHaveBeenCalledWith({
        ...createOrderDto,
        clientId: mockUser.client.id,
      });
    });

    it('should throw ForbiddenException if user is not authorized', async () => {
      const createOrderDto: CreateOrderDto = {
        addressId: 1,
        paymentId: 1,
        shippingFee: 100,
        orderItems: [
          {
            variantId: 1,
            quantity: 2,
            unitPrice: 100,
            customizeUploadId: 1,
            customizePrintId: 1,
          },
        ],
        clientId: 0,
      };

      const unauthorizedUser = { role: 'employee', client: { id: 2 } };
      await expect(
        ordersController.create(createOrderDto, { user: unauthorizedUser }),
      ).rejects.toThrow(ForbiddenException);
    });
  });

  describe('findAll', () => {
    it('should return a list of orders for client', async () => {
      const findOrderDto = { clientId: 1 };
      mockOrdersService.findAll.mockResolvedValue([{ id: 1, ...findOrderDto }]);

      const result = await ordersController.findAll(findOrderDto, {
        user: mockUser,
      });

      expect(result).toEqual([{ id: 1, ...findOrderDto }]);
      expect(mockOrdersService.findAll).toHaveBeenCalledWith({
        ...findOrderDto,
        clientId: mockUser.client.id,
      });
    });

    it('should return a list of orders for admin', async () => {
      const adminUser = { role: 'admin', client: { id: 1 } };
      const findOrderDto = { status: OrderStatus.PROCESSING };

      mockOrdersService.findAll.mockResolvedValue([{ id: 1, ...findOrderDto }]);
      const result = await ordersController.findAll(findOrderDto, {
        user: adminUser,
      });

      expect(result).toEqual([{ id: 1, ...findOrderDto }]);
      expect(mockOrdersService.findAll).toHaveBeenCalledWith(findOrderDto);
    });
  });

  describe('findOne', () => {
    it('should return a single order', async () => {
      const orderId = 1;
      const order = { id: orderId, client: { id: 1 } };

      mockOrdersService.findOne.mockResolvedValue(order);
      const result = await ordersController.findOne(String(orderId), {
        user: mockUser,
      });

      expect(result).toEqual(order);
      expect(mockOrdersService.findOne).toHaveBeenCalledWith(orderId);
    });

    it('should throw ForbiddenException if client does not own order', async () => {
      const orderId = 1;
      const order = { id: orderId, client: { id: 2 } };

      mockOrdersService.findOne.mockResolvedValue(order);
      await expect(
        ordersController.findOne(String(orderId), { user: mockUser }),
      ).rejects.toThrow(ForbiddenException);
    });
  });

  describe('update', () => {
    it('should update an order successfully for admin', async () => {
      const updateOrderDto: UpdateOrderDto = { status: OrderStatus.PROCESSING };
      const orderId = 1;
      const order = {
        id: orderId,
        client: { id: 1 },
        status: OrderStatus.COMPLETED,
      };

      mockOrdersService.findOne.mockResolvedValue(order);
      mockOrdersService.update.mockResolvedValue({
        ...order,
        ...updateOrderDto,
      });

      const result = await ordersController.update(
        String(orderId),
        updateOrderDto,
        { user: { role: 'admin' } },
      );
      expect(result).toEqual({ ...order, ...updateOrderDto });
    });

    it('should throw ForbiddenException if client tries to update another client’s order', async () => {
      const updateOrderDto: UpdateOrderDto = { status: OrderStatus.COMPLETED };
      const orderId = 1;
      const order = { id: orderId, client: { id: 2 } };

      mockOrdersService.findOne.mockResolvedValue(order);
      await expect(
        ordersController.update(String(orderId), updateOrderDto, {
          user: mockUser,
        }),
      ).rejects.toThrow(ForbiddenException);
    });
  });

  describe('remove', () => {
    it('should remove an order successfully for admin', async () => {
      const orderId = 1;
      const order = { id: orderId, client: { id: 1 } };

      mockOrdersService.findOne.mockResolvedValue(order);
      mockOrdersService.remove.mockResolvedValue(order);

      const result = await ordersController.remove(String(orderId), {
        user: { role: 'admin' },
      });
      expect(result).toEqual(order);
      expect(mockOrdersService.remove).toHaveBeenCalledWith(orderId);
    });

    it('should throw ForbiddenException if client tries to remove another client’s order', async () => {
      const orderId = 1;
      const order = { id: orderId, client: { id: 2 } };

      mockOrdersService.findOne.mockResolvedValue(order);
      await expect(
        ordersController.remove(String(orderId), { user: mockUser }),
      ).rejects.toThrow(ForbiddenException);
    });
  });
});
