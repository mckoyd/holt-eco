// services/gateway/src/auth/jwt.strategy.ts

import { createLogger } from '@holt-eco/logger';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthService, AuthenticatedUser, JwtPayload } from './auth.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  private readonly log = createLogger('gateway:jwt-strategy');

  constructor(private readonly authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET ?? 'defaultSecret',
    });
  }

  async validate(payload: JwtPayload): Promise<AuthenticatedUser> {
    await Promise.resolve();
    this.log.debug('validate() → received payload');

    const user = this.authService.validateUser(payload);
    if (!user) {
      this.log.error('validate() → user validation failed for payload');
      throw new UnauthorizedException('Unauthorized');
    }

    this.log.info('validate() → authenticated user');
    return user;
  }
}
