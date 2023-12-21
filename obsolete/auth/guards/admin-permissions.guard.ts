import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Reflector } from '@nestjs/core';
import { AdminPermission } from '../../users/types';
import { PERMISSIONS_KEY } from '../decorators/admin-permissions.decorator';

@Injectable()
export class AdminPermissionsGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const permissions = this.reflector.getAllAndOverride<AdminPermission[]>(PERMISSIONS_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!permissions) {
      return true;
    }
    const { user } = context.switchToHttp().getRequest();

    if (!user.permissions) {
      return true;
    }

    return permissions.some((permission) => user.permissions?.includes(permission));
  }
}
