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
  ForbiddenException,
  Query,
} from '@nestjs/common';

import { JWTGuard } from '@authentication/jwt.guard';
import { Roles } from '@utils/decorators/role.decorator';
import { RolesGuard } from '@utils/guards/roles.guard';
import { AddressesService } from './addresses.service';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import { ApiTags } from '@nestjs/swagger';
import { ApiPaginationQuery, Paginated, PaginateQuery } from 'nestjs-paginate';
import { AddressPaginateConfig } from './configs/address.config';
import { Address } from './entities/address.entity';

@Controller('addresses')
@ApiTags('Addresses')
export class AddressesController {
  constructor(private readonly addressesService: AddressesService) {}

  @UseGuards(JWTGuard, RolesGuard)
  @Roles('client')
  @Post()
  public async create(
    @Body() createAddressDto: CreateAddressDto,
    @Req() { user },
  ) {
    return this.addressesService.create({
      ...createAddressDto,
      clientId: user.client?.id,
    });
  }

  @UseGuards(JWTGuard)
  @Get()
  @ApiPaginationQuery(AddressPaginateConfig)
  public async findAll(
    @Query() query: PaginateQuery,
    @Req() { user },
  ): Promise<Paginated<Address>> {
    return this.addressesService.findAll(query, user.client?.id);
  }

  @UseGuards(JWTGuard)
  @Get(':id')
  public async findOne(@Param('id') id: string, @Req() { user }) {
    const address = await this.addressesService.findOne(+id);

    if (user.client?.id !== address.clientId && user.role !== 'admin') {
      throw new ForbiddenException();
    }

    return address;
  }

  @UseGuards(JWTGuard)
  @Get('client:id')
  public async findByClientId(@Param('id') id: string, @Req() { user }) {
    const addresses = await this.addressesService.findByClientId(+id);

    if (user.client?.id !== addresses?.[0]?.clientId) {
      throw new ForbiddenException();
    }

    return addresses;
  }

  @UseGuards(JWTGuard, RolesGuard)
  @Roles('client')
  @Patch(':id')
  public async update(
    @Param('id') id: string,
    @Body() updateAddressDto: UpdateAddressDto,
    @Req() { user },
  ) {
    const address = await this.addressesService.findOne(+id);

    if (user.client?.id !== address.clientId && user.role !== 'admin') {
      throw new ForbiddenException();
    }

    return this.addressesService.update(+id, {
      ...updateAddressDto,
      clientId: user.client?.id,
    });
  }

  @UseGuards(JWTGuard)
  @Delete(':id')
  public async remove(@Param('id') id: string, @Req() { user }) {
    const address = await this.addressesService.findOne(+id);

    if (user.client?.id !== address.clientId && user.role !== 'admin') {
      throw new ForbiddenException();
    }

    return this.addressesService.remove(+id);
  }
}
