import { Inject, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { JwtService } from '@nestjs/jwt';

import { LoggerService } from '@building/logger';
import { Config } from '@building/config';
import { ExtendedRequest } from './auth.interface';

export class AuthMiddleware implements NestMiddleware {
  private readonly AUTH_HEADER = 'authorization';
  private readonly BEARER_AUTH_SCHEMA = 'bearer';
  private secret;

  constructor(@Inject('CONFIG') private readonly config: Config, private readonly jwtService: JwtService, private readonly logger: LoggerService) {}

  use(req: ExtendedRequest , res: Response, next: NextFunction): any {
    const { algorithms, issuer, secret, publicKey } = this.config.auth as any;

    this.secret = publicKey || secret;

    const token = this.extractToken(req);
    try {
      const verified = this.jwtService.verify(token, { algorithms, issuer });
      if (verified) {
        let roles;
        try {
          roles = verified.realm_access.roles;
        } catch (err) {
          roles = verified.scope || [];
        }

        let resourceRoles = [];
        try {
          resourceRoles = verified.resource_access[this.config.auth.resource].roles;
        } catch (err) {
          resourceRoles = [];
        }

        req.user = {
          id: verified.sub,
          name: verified.preferred_username || verified.name,
          clientId: verified.clientId,
          roles: [...roles, verified.sub],
          resourceRoles,
        };
      }
    } catch (err) {
      const message = err.message ? err.message.charAt(0).toUpperCase() + err.message.slice(1) : 'Invalid Token';
      this.logger.warn('Unauthorized: ' + message);
      throw new UnauthorizedException(message);
    }
    next();

  }
  private extractToken(req: Request): string {
    const authScheme = this.BEARER_AUTH_SCHEMA;
    if (req.headers[this.AUTH_HEADER]) {
      const authParams = this.parseHeader(req.headers[this.AUTH_HEADER]);
      if (authParams && authScheme.toLowerCase() === authParams.scheme.toLowerCase()) {
        return authParams.value;
      }
    }
    return '';
  }

  private parseHeader(header: string | string[]): any {
    if (typeof header !== 'string') {
      return false;
    }
    const regexp = /(\S+)\s+(\S+)/;
    const matches = header.match(regexp);
    return matches && { scheme: matches[1], value: matches[2] };
  }
}
