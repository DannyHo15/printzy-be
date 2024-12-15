import {
  BadRequestException,
  Body,
  Controller,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';

import { UsersService } from '@users/users.service';
import { User } from '@users/entities/user.entity';
import { WEEK_MS } from '@utils/variables';
import { AuthenticationDto } from './dto/authentication.dto';
import { TokensService } from './tokens.service';
import { ApiTags } from '@nestjs/swagger';
import { AuthService } from './authentication.service';
import { JWTGuard } from './jwt.guard';
import { JwtStrategy } from './jwt.strategy';

interface ITokenRequest {
  refreshToken: string;
}

interface RevokeRequest {
  refreshToken: string;
}
@ApiTags('authentication')
@Controller('authentication')
export class AuthenticationController {
  constructor(
    private readonly tokensService: TokensService,
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
  ) {}

  @Post()
  public async create(@Body() { email, password }: AuthenticationDto) {
    const [user] = (
      await this.usersService.findAll({
        $limit: 1,
        email: {
          $eq: email,
        },
      })
    ).data;

    if (
      !user ||
      !(await this.usersService.validateCredentials(user.id, password))
    ) {
      throw new BadRequestException('Invalid email or password');
    }

    const [accessToken, refreshToken] = await Promise.all([
      this.tokensService.generateAccessToken(user),
      this.tokensService.generateRefreshToken(user, WEEK_MS),
    ]);

    return this.buildResponsePayload(user, accessToken, refreshToken);
  }

  @Post('/refresh')
  public async refresh(@Body() body: ITokenRequest) {
    if (!body.refreshToken) {
      throw new BadRequestException('Refresh token must be provided');
    }

    const { user, token } =
      await this.tokensService.createAccessTokenFromRefreshToken(
        body.refreshToken,
      );

    const payload = this.buildResponsePayload(user, token);

    return {
      status: 'success',
      data: payload,
    };
  }

  @Post('/revoke')
  public async revoke(@Body() body: RevokeRequest) {
    if (!body.refreshToken) {
      throw new BadRequestException('Refresh token must be provided');
    }

    const token = await this.tokensService.revokeRefreshToken(
      body.refreshToken,
    );

    return {
      status: token.isRevoked ? 'success' : 'fail',
    };
  }

  @Post('send-reset-password-email')
  async sendResetPasswordEmail(@Body() body: { email: string }): Promise<void> {
    const [user] = (
      await this.usersService.findAll({
        $limit: 1,
        email: {
          $eq: body.email,
        },
      })
    ).data;

    if (!user) {
      throw new BadRequestException('Invalid email');
    }
    return await this.authService.sendResetPasswordEmail(user);
  }

  @UseGuards(JWTGuard)
  @Post('reset-password')
  async resetPassword(
    @Req() { user },
    @Body() body: { token: string; newPassword: string },
  ) {
    return await this.authService.resetPassword(user.id, body.newPassword);
  }

  private buildResponsePayload(
    user: User,
    accessToken: string,
    refreshToken?: string,
  ) {
    return {
      user,
      payload: {
        accessToken,
        ...(refreshToken ? { refreshToken } : {}),
      },
    };
  }
}
