import { createLogger } from '@holt-eco/logger';
import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';
import { IS_PUBLIC_KEY } from './public.decorator';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  private readonly log = createLogger('gateway:auth-guard');
  constructor(private readonly reflector: Reflector) {
    super();
  }

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const isPublicRoute = this.reflector.getAllAndOverride<boolean>(
      IS_PUBLIC_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (isPublicRoute) {
      return true;
    }

    this.log.info('Protected route → proceeding with auth guard');
    return super.canActivate(context);
  }

  // Override handleRequest with full signature
  handleRequest<TUser = any>(
    err: any,
    user: TUser | false,
    info: unknown,
    context: ExecutionContext,
    status?: any,
  ): TUser {
    this.log.debug(
      { err, info, status, context },
      'handleRequest → authentication callback',
    );

    if (err || !user) {
      this.log.warn(
        { err, info, status },
        'JwtAuthGuard.handleRequest → authentication failed',
      );
      throw (
        err ||
        new UnauthorizedException('Invalid or missing authentication token')
      );
    }

    this.log.info('JwtAuthGuard.handleRequest → authentication succeeded');
    return user;
  }
}
