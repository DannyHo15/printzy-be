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
  BadRequestException,
  Query,
  ForbiddenException,
} from '@nestjs/common';

import { JWTGuard } from '@authentication/jwt.guard';
import { RolesGuard } from '@utils/guards/roles.guard';
import { Roles } from '@utils/decorators/role.decorator';
import { OrdersService } from '@orders/orders.service';
import { PurchasesService } from './purchases.service';
import { CreatePurchaseDto } from './dto/create-purchase.dto';
import { UpdatePurchaseDto } from './dto/update-purchase.dto';
import { FindPurchaseDto } from './dto/find-purchase.dto';
import { ApiTags } from '@nestjs/swagger';

@Controller('purchases')
@ApiTags('purchases')
export class PurchasesController {
  constructor(
    private readonly purchasesService: PurchasesService,
    private readonly ordersService: OrdersService,
  ) {}

  @UseGuards(JWTGuard, RolesGuard)
  @Roles('client')
  @Post()
  public async create(
    @Body() createPurchaseDto: CreatePurchaseDto,
    @Req() { user },
  ) {
    const order = await this.ordersService.findOne(createPurchaseDto.orderId);

    if (order.client.id !== user.client?.id) {
      throw new BadRequestException('Unknown order');
    }

    return this.purchasesService.create({
      ...createPurchaseDto,
      clientId: user.client?.id,
    });
  }

  @UseGuards(JWTGuard)
  @Get()
  public async findAll(@Query() query: FindPurchaseDto, @Req() { user }) {
    return this.purchasesService.findAll(
      user.role === 'admin' ? query : { ...query, clientId: user.client?.id },
    );
  }

  @UseGuards(JWTGuard)
  @Get('/order/:id')
  public async findOneByOrderId(@Param('id') id: string, @Req() { user }) {
    const purchase = await this.purchasesService.findOneByOrderId(+id);

    if (user.client?.id !== purchase.clientId && user.role !== 'admin') {
      throw new ForbiddenException();
    }

    return purchase;
  }

  @UseGuards(JWTGuard)
  @Get(':id')
  public async findOne(@Param('id') id: string, @Req() { user }) {
    const purchase = await this.purchasesService.findOne(+id);

    if (user.client?.id !== purchase.clientId && user.role !== 'admin') {
      throw new ForbiddenException();
    }

    return purchase;
  }

  @UseGuards(JWTGuard, RolesGuard)
  @Roles('admin', 'employee')
  @Patch(':id')
  public async update(
    @Param('id') id: string,
    @Body() updatePurchaseDto: UpdatePurchaseDto,
  ) {
    return this.purchasesService.update(+id, {
      ...updatePurchaseDto,
    });
  }

  @UseGuards(JWTGuard, RolesGuard)
  @Roles('admin', 'employee')
  @Delete(':id')
  public async remove(@Param('id') id: string, @Req() { user }) {
    const purchase = await this.purchasesService.findOne(+id);

    if (user.client?.id !== purchase.clientId && user.role !== 'admin') {
      throw new ForbiddenException();
    }

    return this.purchasesService.remove(+id);
  }
}
