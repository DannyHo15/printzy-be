import { Test, TestingModule } from '@nestjs/testing';
import { PaymentsController } from './payments.controller';
import { PaymentsService } from './payments.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { FindPaymentDto } from './dto/find-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { CreateVnpayPaymentUrlDTO } from './dto/create-vnpay-payment-url.dto';
import { JWTGuard } from '@authentication/jwt.guard';
import { RolesGuard } from '@utils/guards/roles.guard';
import { Roles } from '@utils/decorators/role.decorator';
import { of } from 'rxjs';
import { PaymentMethod } from './entities/payment.entity';

// Mock Data
const mockPayment = { id: 1, paymentMethod: 'MOMO', sum: 1000 };
const mockUser = { role: 'admin', client: { id: 1 } };

// Mock Service
const mockPaymentsService = {
  create: jest.fn().mockResolvedValue(mockPayment),
  findAll: jest.fn().mockResolvedValue([mockPayment]),
  findOne: jest.fn().mockResolvedValue(mockPayment),
  update: jest
    .fn()
    .mockResolvedValue({ ...mockPayment, paymentMethod: 'CASH' }),
  remove: jest.fn().mockResolvedValue({ deleted: true }),
  createVnpayPaymentUrl: jest
    .fn()
    .mockResolvedValue({ url: 'http://vnpay.com' }),
};

describe('PaymentsController', () => {
  let controller: PaymentsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PaymentsController],
      providers: [
        {
          provide: PaymentsService,
          useValue: mockPaymentsService,
        },
      ],
    })
      .overrideGuard(JWTGuard)
      .useValue({ canActivate: () => true })
      .overrideGuard(RolesGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<PaymentsController>(PaymentsController);
  });

  // Test Create Payment
  describe('create', () => {
    it('should create a payment', async () => {
      const dto: CreatePaymentDto = { paymentMethod: PaymentMethod.VNPAY };
      const result = await controller.create(dto, { user: mockUser });
      expect(result).toBeNull();
      expect(mockPaymentsService.create).toHaveBeenCalledWith(dto);
    });
  });

  // Test Find All Payments
  describe('findAll', () => {
    it('should return all payments for admin', async () => {
      const query: FindPaymentDto = {};
      const result = await controller.findAll(query, { user: mockUser });
      expect(result).toEqual([mockPayment]);
      expect(mockPaymentsService.findAll).toHaveBeenCalledWith(query);
    });

    it('should filter payments for clients', async () => {
      const query: FindPaymentDto = {};
      const clientUser = { ...mockUser, role: 'client' };
      const result = await controller.findAll(query, { user: clientUser });
      expect(result).toEqual([mockPayment]);
      expect(mockPaymentsService.findAll).toHaveBeenCalledWith({
        ...query,
        clientId: 1,
      });
    });
  });

  // Test Find One Payment
  describe('findOne', () => {
    it('should return one payment', async () => {
      const result = await controller.findOne('1');
      expect(result).toEqual(mockPayment);
      expect(mockPaymentsService.findOne).toHaveBeenCalledWith(1);
    });
  });

  // Test Update Payment
  describe('update', () => {
    it('should update a payment', async () => {
      const dto: UpdatePaymentDto = { paymentMethod: PaymentMethod.VNPAY };
      const result = await controller.update('1', dto);
      expect(result).toEqual({
        ...mockPayment,
        paymentMethod: PaymentMethod.VNPAY,
      });
      expect(mockPaymentsService.update).toHaveBeenCalledWith(1, dto);
    });
  });

  // Test Delete Payment
  describe('remove', () => {
    it('should remove a payment', async () => {
      const result = await controller.remove('1');
      expect(result).toEqual({ deleted: true });
      expect(mockPaymentsService.remove).toHaveBeenCalledWith(1);
    });
  });

  // Test Create Vnpay Payment URL
  describe('createPaymentUrl', () => {
    it('should create a VNPAY payment URL', async () => {
      const dto: CreateVnpayPaymentUrlDTO = {
        sum: 1000,
        orderId: 123,
        paymentMethod: PaymentMethod.VNPAY,
      };
      const headers = {};
      const connection = {};
      const socket = {};
      const result = await controller.createPaymentUrl(dto, {
        user: mockUser,
        headers,
        connection,
        socket,
      });
      expect(result).toEqual({ url: 'http://vnpay.com' });
      expect(mockPaymentsService.createVnpayPaymentUrl).toHaveBeenCalledWith(
        dto,
        headers,
        connection,
        socket,
      );
    });
  });
});
