import { createLogger } from '@holt-eco/logger';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const log = createLogger('gateway');
  const port = process.env.PORT ? Number(process.env.PORT) : 3000;

  try {
    const app = await NestFactory.create(AppModule);
    await app.listen(port);
    log.info(`Gateway listening on port ${port}`);
  } catch (err: unknown) {
    log.error({ err }, 'Gateway failed to start');
    process.exit(1);
  }
}

bootstrap();
