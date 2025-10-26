import { createLogger } from '@holt-eco/logger';
import { Controller, Get } from '@nestjs/common';

@Controller('ping')
export class PingController {
  private readonly log = createLogger('gateway:ping');

  @Get()
  ping() {
    this.log.info('Ping endpoint invoked');
    return { message: 'pong', time: new Date().toISOString() };
  }
}
