import { createLogger } from '@holt-eco/logger';
import { Controller, Get } from '@nestjs/common';
import { Public } from '../auth/public.decorator';

@Controller('health')
export class HealthController {
  private readonly log = createLogger('gateway:health');

  @Public()
  @Get()
  check() {
    this.log.info('Health check endpoint invoked');
    return { status: 'ok' };
  }
}
