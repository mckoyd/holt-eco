import { createLogger } from '@holt-eco/logger';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

export interface JwtPayload {
  sub: string;
  email: string;
}

export interface AuthenticatedUser {
  id: string;
  email: string;
}

@Injectable()
export class AuthService {
  private readonly log = createLogger('gateway:auth-service');

  constructor(private readonly jwtService: JwtService) {}

  validateUser(payload: JwtPayload): AuthenticatedUser {
    this.log.debug('AuthService.validateUser → payload received');
    const { sub: id, email } = payload;

    if (!id || !email) {
      this.log.warn(
        'AuthService.validateUser → missing id or email in payload',
      );
      throw new UnauthorizedException('Invalid token payload');
    }

    const user = { id, email };
    this.log.info('AuthService.validateUser → user validated');
    return user;
  }

  async login(user: AuthenticatedUser): Promise<{ access_token: string }> {
    this.log.debug('AuthService.login → user authentication start');
    const payload: JwtPayload = { sub: user.id, email: user.email };
    this.log.debug('AuthService.login → payload prepared for token');

    const access_token = await this.jwtService.signAsync(payload);

    this.log.info('AuthService.login → token generated');

    return { access_token };
  }
}
