import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/user-roles.decorator';

import { EUserRole } from '../../users/types';

import exceptions from '../../common/constants/exceptions';

@Injectable()
export class UserRolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const roles = this.reflector.getAllAndOverride<EUserRole[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!roles) {
      return true;
    }

    console.log(`user-roles.guard.ts - 1) Маршрут доступен для ролей: ${roles}`);

    const { user } = context.switchToHttp().getRequest();

    console.log(
      `user-roles.guard.ts - 2) Пользователь извлечен из контекста для получения его роли: ${user}`
    );

    if (!user) {
      throw new UnauthorizedException(exceptions.auth.unauthorized);
    }

    return roles.some((role) => role === user.role);
  }
}
