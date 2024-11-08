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
  BadRequestException,
} from '@nestjs/common';
// import { InjectStripe } from 'nestjs-stripe';
import Stripe from 'stripe';

import { JWTGuard } from '@authentication/jwt.guard';
import { RolesGuard } from '@utils/guards/roles.guard';
import { Roles } from '@utils/decorators/role.decorator';
import { KOPECKS_IN_RUBLE } from '@utils/variables';
import { PaymentsService } from './payments.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { FindPaymentDto } from './dto/find-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { VnpayService } from './vnpay.service';
import { User } from '@app/users/entities/user.entity';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@Controller('payments')
@ApiTags('Payments')
@ApiBearerAuth()
export class PaymentsController {
  constructor(
    private readonly paymentsService: PaymentsService,
    // @InjectStripe() private readonly stripeClient: Stripe,
    private readonly vnpayService: VnpayService,
  ) {}

  @UseGuards(JWTGuard, RolesGuard)
  @Roles('client')
  @Post()
  public async create(
    @Body() createPaymentDto: CreatePaymentDto,
    @Req() { user },
  ) {
    const payment = await this.paymentsService.create({
      ...createPaymentDto,
      clientId: user.client?.id,
    });

    if (createPaymentDto.paymentMethod === 'vnpay') {
      return { paymentUrl: payment.paymentUrl };
    }
    return null;
  }

  @UseGuards(JWTGuard, RolesGuard)
  @Roles('client')
  @Post('vnpay/create_payment_url')
  async createVnpayPayment(
    @Body() createPaymentDto: CreatePaymentDto,
    @Req() user,
  ) {
    console.log('createPaymentDto', createPaymentDto);
    const payment = await this.paymentsService.create({
      ...createPaymentDto,
    });

    return { data: payment };
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
  public async findOne(@Param('id') id: string, @Req() { user }) {
    const payment = await this.paymentsService.findOne(+id);

    if (user.client?.id !== payment.clientId && user.role !== 'admin') {
      throw new ForbiddenException();
    }

    return payment;
  }

  @UseGuards(JWTGuard, RolesGuard)
  @Roles('client')
  @Patch(':id')
  public async update(
    @Param('id') id: string,
    @Body() updatePaymentDto: UpdatePaymentDto,
    @Req() { user },
  ) {
    const payment = await this.paymentsService.findOne(+id);

    if (user.client?.id !== payment.clientId && user.role !== 'admin') {
      throw new ForbiddenException();
    }

    return this.paymentsService.update(+id, {
      ...updatePaymentDto,
      clientId: user.client?.id,
      sum: payment.sum,
    });
  }

  @UseGuards(JWTGuard)
  @Delete(':id')
  public async remove(@Param('id') id: string, @Req() { user }) {
    const payment = await this.paymentsService.findOne(+id);

    if (user.client?.id !== payment.clientId && user.role !== 'admin') {
      throw new ForbiddenException();
    }

    return this.paymentsService.remove(+id);
  }

  @UseGuards(JWTGuard)
  @Post('vnpay/create_payment_url')
  public async createPaymentUrl(
    @Body() createPaymentDto: CreatePaymentDto,
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
