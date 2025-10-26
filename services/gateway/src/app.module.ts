import { createLogger } from '@holt-eco/logger';
import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { HealthController } from './health/health.controller';
import { PingController } from './ping/ping.controller';
import { ProxyController } from './proxy/proxy.controller';
import { ProxyService } from './proxy/proxy.service';

import { APP_GUARD } from '@nestjs/core';
import { AuthModule } from './auth/auth.module';
import { JwtAuthGuard } from './auth/jwt-auth.guard';

@Module({
  imports: [
    HttpModule.register({
      timeout: 5000,
      maxRedirects: 3,
    }),
    AuthModule,
  ],
  controllers: [ProxyController, HealthController, PingController],
  providers: [
    ProxyService,
    {
      provide: 'APP_LOGGER',
      useFactory: () => createLogger('gateway-app'),
    },
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
