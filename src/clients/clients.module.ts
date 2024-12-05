import { forwardRef, Module } from '@nestjs/common';
import { ClientsController } from './clients.controller';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UsersModule } from '@users/users.module';
import { Client } from './entities/client.entity';
import { ClientsService } from './clients.service';
import { RefreshTokensRepository } from '@app/authentication/refresh-tokens.repository';
import { JwtModule } from '@nestjs/jwt';
import { TokensService } from '@app/authentication/tokens.service';
import { RefreshToken } from '@app/authentication/entities/refresh-token.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Client, RefreshToken]),
    UsersModule,
    JwtModule,
  ],
  controllers: [ClientsController],
  providers: [ClientsService, TokensService, RefreshTokensRepository],
  exports: [ClientsService],
})
export class ClientsModule {}
