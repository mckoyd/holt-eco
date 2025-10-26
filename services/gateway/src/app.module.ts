import { createLogger } from '@holt-eco/logger';
import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ProxyController } from './proxy/proxy.controller';
import { ProxyService } from './proxy/proxy.service';

@Module({
  imports: [
    HttpModule.register({
      timeout: 5000,
      maxRedirects: 3,
    }),
  ],
  controllers: [ProxyController],
  providers: [
    ProxyService,
    {
      provide: 'APP_LOGGER',
      useFactory: () => createLogger('gateway-app'),
    },
  ],
})
export class AppModule {}
