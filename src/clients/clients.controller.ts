import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  Req,
  ForbiddenException,
  UseGuards,
} from '@nestjs/common';

import { JWTGuard } from '@authentication/jwt.guard';
import { UsersService } from '@users/users.service';
import { Roles } from '@utils/decorators/role.decorator';
import { RolesGuard } from '@utils/guards/roles.guard';
import { ClientsService } from './clients.service';
import { CreateClientDto } from './dto/create-client.dto';
import { FindClientDto } from './dto/find-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { ApiTags } from '@nestjs/swagger';

@Controller('clients')
@ApiTags('clients')
export class ClientsController {
  constructor(
    private readonly clientsService: ClientsService,
    private readonly usersService: UsersService,
  ) {}

  @Post()
  public async create(@Body() createClientDto: CreateClientDto) {
    return this.clientsService.create(createClientDto);
  }

  @UseGuards(JWTGuard)
  @Roles('admin', 'client')
  @Get()
  public async findAll(@Query() query: FindClientDto, @Req() { user }) {
    return this.clientsService.findAll(query);
  }

  @UseGuards(JWTGuard)
  @Get(':id')
  public async findOne(@Param('id') id: string, @Req() { user }) {
    const client = await this.clientsService.findOne(+id);

    if (user.id !== client.userId && user.role !== 'admin') {
      throw new ForbiddenException();
    }

    return client;
  }

  @UseGuards(JWTGuard, RolesGuard)
  @Roles('client')
  @Patch(':id')
  public async update(
    @Param('id') id: string,
    @Body() updateClientDto: UpdateClientDto,
    @Req() { user },
  ) {
    const client = await this.clientsService.findOne(+id);

    if (user.id !== client.userId && user.role !== 'admin') {
      throw new ForbiddenException();
    }

    return this.clientsService.update(+id, {
      ...updateClientDto,
      userId: user.id,
    });
  }

  @UseGuards(JWTGuard)
  @Delete(':id')
  public async remove(@Param('id') id: string, @Req() { user }) {
    const client = await this.clientsService.findOne(+id);

    if (user.id !== client.userId && user.role !== 'admin') {
      throw new ForbiddenException();
    }

    return this.usersService.remove(client.userId);
  }
}
