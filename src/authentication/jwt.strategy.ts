import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { jwtExpiresIn } from '@utils/variables';
import { User } from '@users/entities/user.entity';
import { UsersService } from '@users/users.service';
import { ClientsService } from '@clients/clients.service';

export interface AccessTokenPayload {
  sub: number;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  public constructor(
    private users: UsersService,
    private clients: ClientsService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
      signOptions: {
        expiresIn: jwtExpiresIn,
      },
    });
  }

  async validate(payload: AccessTokenPayload): Promise<User> {
    const { sub: id } = payload;
    console.log(payload);
    const user = await this.users.findOne(id);

    if (!user) {
      return null;
    }

    if (user.role === 'client') {
      console.log(user);
      const clients = await this.clients.findOne(user.client.id);
      user.client = clients;
    }

    return user;
  }
}
