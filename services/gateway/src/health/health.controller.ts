import { createLogger } from '@holt-eco/logger';
import { Controller, Get } from '@nestjs/common';

@Controller('health')
export class HealthController {
  private readonly log = createLogger('gateway:health');

  @Get()
  check() {
    this.log.info('Health check endpoint invoked');
    return { status: 'ok' };
  }
}
