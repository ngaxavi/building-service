import { Inject, Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

import { Config } from '@building/config';
import { LoggerService } from './logger.service';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  constructor(@Inject('CONFIG') private readonly config: Config, private readonly logger: LoggerService) {}

  use(req: Request, res: Response, next: NextFunction): void {
    let ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.socket.remoteAddress;
    ip = ip === '::1' ? 'localhost' : ip;

    this.logger.log(`${req.method} Request for ${req.baseUrl} from ${ip}`);
    if (req.method === 'POST' || req.method === 'PUT') {
      this.logger.debug(`${req.method} Request body: ${JSON.stringify(req.body).substring(0, 100)}`);
    }
    next();
  }
}
