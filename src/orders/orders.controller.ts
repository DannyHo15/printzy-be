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
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { FindOrderDto } from './dto/find-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { ApiTags } from '@nestjs/swagger';

@Controller('orders')
@ApiTags('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @UseGuards(JWTGuard, RolesGuard)
  @Roles('client')
  @Post()
  public async create(@Body() createOrderDto: CreateOrderDto, @Req() { user }) {
    const order = await this.ordersService.create({
      ...createOrderDto,
      clientId: user.client?.id,
    });

    return order;
  }

  @UseGuards(JWTGuard)
  @Get()
  public async findAll(@Query() query: FindOrderDto, @Req() { user }) {
    return this.ordersService.findAll(
      user.role === 'admin' ? query : { ...query, clientId: user.client?.id },
    );
  }

  @UseGuards(JWTGuard)
  @Get(':id')
  public async findOne(@Param('id') id: string, @Req() { user }) {
    const order = await this.ordersService.findOne(+id);

    if (user.client?.id !== order.client.id && user.role !== 'admin') {
      throw new ForbiddenException();
    }

    return order;
  }

  @UseGuards(JWTGuard, RolesGuard)
  @Roles('admin')
  @Patch(':id')
  public async update(
    @Param('id') id: string,
    @Body() updateOrderDto: UpdateOrderDto,
    @Req() { user },
  ) {
    const order = await this.ordersService.findOne(+id);

    return this.ordersService.update(+id, {
      ...updateOrderDto,
      clientId: user.client?.id,
    });
  }

  @UseGuards(JWTGuard)
  @Delete(':id')
  public async remove(@Param('id') id: string, @Req() { user }) {
    const order = await this.ordersService.findOne(+id);

    if (user.client?.id !== order.client.id && user.role !== 'admin') {
      throw new ForbiddenException();
    }

    return this.ordersService.remove(+id);
  }
}
