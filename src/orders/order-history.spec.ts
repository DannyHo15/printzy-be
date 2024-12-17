import { Test, TestingModule } from '@nestjs/testing';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { FindOrderDto } from './dto/find-order.dto';
import { JWTGuard } from '@authentication/jwt.guard';
import { ForbiddenException } from '@nestjs/common';
import { OrderStatus } from '@app/utils/types/order';

describe('OrdersController - findAll', () => {
  let controller: OrdersController;
  let service: OrdersService;

  const mockOrdersService = {
    findAll: jest.fn(),
  };

  const adminUser = { role: 'admin', client: { id: 1 } };
  const clientUser = { role: 'client', client: { id: 2 } };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrdersController],
      providers: [{ provide: OrdersService, useValue: mockOrdersService }],
    })
      .overrideGuard(JWTGuard)
      .useValue({ canActivate: jest.fn(() => true) })
      .compile();

    controller = module.get<OrdersController>(OrdersController);
    service = module.get<OrdersService>(OrdersService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should call findAll with query for admin user', async () => {
    const query: FindOrderDto = { id: 123, status: OrderStatus.PROCESSING };
    const result = [{ id: 123, status: OrderStatus.PROCESSING }];
    mockOrdersService.findAll.mockResolvedValue(result);

    const response = await controller.findAll(query, { user: adminUser });

    expect(service.findAll).toHaveBeenCalledWith(query);
    expect(response).toEqual(result);
  });

  it('should add clientId to query for client user', async () => {
    const query: FindOrderDto = { status: OrderStatus.COMPLETED };
    const expectedQuery = { ...query, clientId: clientUser.client.id };
    const result = [{ id: 456, status: OrderStatus.COMPLETED }];
    mockOrdersService.findAll.mockResolvedValue(result);

    const response = await controller.findAll(query, { user: clientUser });

    expect(service.findAll).toHaveBeenCalledWith(expectedQuery);
    expect(response).toEqual(result);
  });

  it('should handle empty query', async () => {
    const query: FindOrderDto = {};
    const result = [{ id: 789, status: OrderStatus.DELIVERY }];
    mockOrdersService.findAll.mockResolvedValue(result);

    const response = await controller.findAll(query, { user: adminUser });

    expect(service.findAll).toHaveBeenCalledWith(query);
    expect(response).toEqual(result);
  });

  it('should throw error when ordersService.findAll fails', async () => {
    const query: FindOrderDto = { status: OrderStatus.PROCESSING };
    mockOrdersService.findAll.mockRejectedValue(new Error('Service Error'));

    await expect(
      controller.findAll(query, { user: adminUser }),
    ).rejects.toThrow('Service Error');

    expect(service.findAll).toHaveBeenCalledWith(query);
  });
});
