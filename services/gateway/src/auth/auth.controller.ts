import { createLogger } from '@holt-eco/logger';
import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService, AuthenticatedUser } from './auth.service';
import { Public } from './public.decorator';

class LoginDto {
  email!: string;
  password: string;
}

@Controller('auth')
export class AuthController {
  private readonly log = createLogger('gateway:auth-guard');
  constructor(private readonly authService: AuthService) {}

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(@Body() dto: LoginDto): Promise<{ access_token: string }> {
    this.log.debug('AuthController.login → received DTO');
    const user: AuthenticatedUser = {
      id: dto.email,
      email: dto.email,
    };
    this.log.info('AuthController.login → login successful for user');
    const result = await this.authService.login(user);
    this.log.debug('AuthController.login → access_token granted');
    return result;
  }
}
