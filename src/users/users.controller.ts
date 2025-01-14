import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  Req,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';

import { JWTGuard } from '@authentication/jwt.guard';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { FindUserDto } from './dto/find-user.dto';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { User } from './entities/user.entity';
import { RolesGuard } from '@app/utils/guards/roles.guard';
import { Roles } from '@utils/decorators/role.decorator';

@ApiBearerAuth()
@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JWTGuard, RolesGuard)
  @Roles('admin')
  @Post()
  @ApiOperation({ summary: 'Create user' })
  @ApiResponse({
    status: 200,
    description: 'The found record',
    type: User,
  })
  public async create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @UseGuards(JWTGuard)
  @Get()
  public async findAll(@Query() query: FindUserDto, @Req() { user }) {
    return this.usersService.findAll(
      user.role === 'admin' ? query : { ...query, id: user.id },
    );
  }

  @UseGuards(JWTGuard)
  @Get(':id')
  @ApiResponse({
    status: 200,
    description: 'The found record',
    type: User,
  })
  public async findOne(@Param('id') id: string, @Req() { user }) {
    if (user.id !== +id && user.role !== 'admin') {
      throw new BadRequestException("You can't access this user");
    }

    return this.usersService.findOne(+id);
  }

  @UseGuards(JWTGuard)
  @Patch(':id')
  public async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @Req() { user },
  ) {
    if (String(user.id) !== id && user.role !== 'admin') {
      throw new ForbiddenException();
    }

    return this.usersService.update(+id, { ...updateUserDto });
  }

  @UseGuards(JWTGuard, RolesGuard)
  @Roles('admin')
  @Delete(':id')
  public async remove(@Param('id') id: string, @Req() { user }) {
    if (String(user.id) !== id && user.role !== 'admin') {
      throw new ForbiddenException();
    }

    return this.usersService.remove(+id);
  }
}
