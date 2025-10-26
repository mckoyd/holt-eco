import { createLogger } from '@holt-eco/logger';
import { All, Controller, HttpStatus, Req, Res } from '@nestjs/common';
import type { Request, Response } from 'express';
import { ProxyService } from './proxy.service';

@Controller()
export class ProxyController {
  private readonly logger = createLogger('gateway-controller');

  constructor(private readonly proxyService: ProxyService) {}

  /**
   * Forwards any HTTP request to the corresponding service
   * based on its path prefix.
   */
  @All('proxy/*path')
  async handle(@Req() req: Request, @Res() res: Response) {
    const method = req.method;
    const originalUrl = req.originalUrl;
    const body = req.body as Record<string, unknown>; // ✅ explicit, safe type

    this.logger.info({ method, originalUrl }, 'Incoming proxied request');

    try {
      const data = await this.proxyService.forward(method, originalUrl, body);
      return res.status(HttpStatus.OK).json(data);
    } catch (err: unknown) {
      const hasHttpStatus = (e: unknown): e is { getStatus: () => number } =>
        typeof e === 'object' &&
        e !== null &&
        'getStatus' in e &&
        typeof (e as Record<string, unknown>).getStatus === 'function';

      const hasMessage = (e: unknown): e is { message: string } =>
        typeof e === 'object' &&
        e !== null &&
        'message' in e &&
        typeof (e as Record<string, unknown>).message === 'string';

      const status: number = hasHttpStatus(err)
        ? err.getStatus()
        : HttpStatus.BAD_GATEWAY;

      const message: string = hasMessage(err) ? err.message : 'Proxy error';

      this.logger.error({ status, message }, 'Proxy failed');

      return res.status(status).json({ message });
    }
  }
}
