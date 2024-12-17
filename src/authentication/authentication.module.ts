import { forwardRef, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';

import { UsersModule } from '@app/users/users.module';
import { jwtExpiresIn } from '@app/utils/variables';
import { AuthenticationController } from './authentication.controller';
import { RefreshToken } from './entities/refresh-token.entity';
import { RefreshTokensRepository } from './refresh-tokens.repository';
import { TokensService } from './tokens.service';
import { JwtStrategy } from './jwt.strategy';
import { ClientsModule } from 'src/clients/clients.module';
import { AuthService } from './authentication.service';
import { User } from '@app/users/entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([RefreshToken, User]),
    forwardRef(() => ClientsModule),
    PassportModule.register({}),
    JwtModule.register({
      secret:
        '86511525c07104986c3b9b90f3f3cd2d60f681175308f1c7554fae69d90a96299',
      signOptions: {
        expiresIn: jwtExpiresIn,
      },
    }),
    UsersModule,
  ],
  controllers: [AuthenticationController],
  providers: [RefreshTokensRepository, JwtStrategy, TokensService, AuthService],
})
export class AuthenticationModule {}
