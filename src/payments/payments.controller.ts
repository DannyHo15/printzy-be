import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  Query,
  ForbiddenException,
} from '@nestjs/common';

import { JWTGuard } from '@authentication/jwt.guard';
import { RolesGuard } from '@utils/guards/roles.guard';
import { Roles } from '@utils/decorators/role.decorator';
import { PaymentsService } from './payments.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { FindPaymentDto } from './dto/find-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { VnpayService } from './vnpay.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CreateVnpayPaymentUrlDTO } from './dto/create-vnpay-payment-url.dto';

@Controller('payment')
@ApiTags('Payment')
@ApiBearerAuth()
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @UseGuards(JWTGuard, RolesGuard)
  @Roles('admin')
  @Post()
  public async create(
    @Body() createPaymentDto: CreatePaymentDto,
    @Req() { user },
  ) {
    const payment = await this.paymentsService.create({
      ...createPaymentDto,
    });

    return null;
  }

  @UseGuards(JWTGuard)
  @Get()
  public async findAll(@Query() query: FindPaymentDto, @Req() { user }) {
    return this.paymentsService.findAll(
      user.role === 'admin' ? query : { ...query, clientId: user.client?.id },
    );
  }

  @UseGuards(JWTGuard)
  @Get(':id')
  public async findOne(@Param('id') id: string) {
    const payment = await this.paymentsService.findOne(+id);

    return payment;
  }

  @UseGuards(JWTGuard, RolesGuard)
  @Roles('client')
  @Patch(':id')
  public async update(
    @Param('id') id: string,
    @Body() updatePaymentDto: UpdatePaymentDto,
  ) {
    const payment = await this.paymentsService.findOne(+id);

    return this.paymentsService.update(+id, {
      ...updatePaymentDto,
    });
  }

  @UseGuards(JWTGuard)
  @Delete(':id')
  public async remove(@Param('id') id: string) {
    const payment = await this.paymentsService.findOne(+id);

    return this.paymentsService.remove(+id);
  }

  @UseGuards(JWTGuard)
  @Post('vnpay/create_payment_url')
  public async createPaymentUrl(
    @Body() createPaymentDto: CreateVnpayPaymentUrlDTO,
    @Req() { user, headers, connection, socket },
  ) {
    return this.paymentsService.createVnpayPaymentUrl(
      {
        ...createPaymentDto,
      },
      headers,
      connection,
      socket,
    );
  }
}
