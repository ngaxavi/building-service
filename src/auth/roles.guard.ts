import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { LoggerService } from '@building/logger';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector, private readonly logger: LoggerService) {}

  canActivate(context: ExecutionContext): boolean {
    const handler = context.getHandler();
    const roles = this.reflector.get<string[]>('roles', handler);
    if (!roles) {
      return true;
    }
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const hasRole = () => {
      const a = !!user.roles.find((role) => !!roles.find((item) => item === role));
      const b = !!user.resourceRoles.find((role) => !!roles.find((item) => item === role));
      return a || b;
    };
    if (user && user.roles && hasRole()) {
      return true;
    } else {
      this.logger.warn('Forbidden. Required Roles: ' + roles.toLocaleString());
      return false;
    }
  }
}
