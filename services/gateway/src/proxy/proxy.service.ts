import { createLogger } from '@holt-eco/logger';
import { HttpService } from '@nestjs/axios';
import { HttpException, Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class ProxyService {
  private readonly logger = createLogger('gateway-proxy');

  private readonly routes: Record<string, string> = {
    '/proxy/health': 'http://localhost:3001',
    '/api/auth': 'http://localhost:3001',
    '/api/recon': 'http://localhost:3006',
  };

  constructor(private readonly httpService: HttpService) {}

  private resolveTarget(path: string): string {
    const match = Object.keys(this.routes).find((r) => path.startsWith(r));
    if (!match) throw new HttpException(`No route for ${path}`, 404);
    return this.routes[match];
  }

  async forward<TResponse = unknown>(
    method: string,
    path: string,
    body?: unknown,
  ): Promise<TResponse> {
    const target = this.resolveTarget(path);
    const url = `${target}${path}`;

    this.logger.info({ method, url }, 'Forwarding request');

    try {
      const response = await firstValueFrom(
        this.httpService.request<TResponse>({ method, url, data: body }),
      );
      return response.data;
    } catch (error) {
      this.logger.error({ error }, 'Proxy request failed');
      throw new HttpException('Proxy request failed', 502);
    }
  }
}
