import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { jwtExpiresIn } from '@utils/variables';
import { User } from '@users/entities/user.entity';
import { UsersService } from '@users/users.service';
import { ClientsService } from '@clients/clients.service';
import { ConfigService } from '@nestjs/config';
export interface AccessTokenPayload {
  sub: number;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  public constructor(
    private users: UsersService,
    private clients: ClientsService,
    private configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET'),
      signOptions: {
        expiresIn: jwtExpiresIn,
      },
    });
    console.log('jwt strategy', process.env.JWT_SECRET);
    console.log('jwt strategy', configService.get<string>('JWT_SECRET'));
  }

  async validate(payload: AccessTokenPayload): Promise<User> {
    const { sub: id } = payload;
    const user = await this.users.findOne(id);

    if (!user) {
      return null;
    }

    if (user.role === 'client') {
      const clients = await this.clients.findOne(user.client.id);
      user.client = clients;
    }

    return user;
  }
}
