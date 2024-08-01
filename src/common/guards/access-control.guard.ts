import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { UserRole } from '../types/user.types';
import { AccessRightsObject } from '../types/access-rights.types';
import { ACL_KEY, IS_PUBLIC_KEY } from '../constants/keys';

@Injectable()
export class AccessControlGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }
    const accessControl: AccessRightsObject = this.reflector.get<AccessRightsObject>(
      ACL_KEY,
      context.getHandler()
    ); /* {
      role: this.reflector.get<UserRole>('role', context.getHandler()),
      rights: this.reflector.get<Array<AccessRightType>>('rights', context.getHandler()),
      level: this.reflector.get<UserStatus>('level', context.getHandler()),
      isRoot: this.reflector.get<boolean>('root', context.getHandler()) ?? false,
    }; */
    if (!accessControl) {
      return false;
    }
    const { user } = context.switchToHttp().getRequest();
    if (user.role === UserRole.ADMIN && user.isRoot) return true;
    if (accessControl.isRoot) {
      return (!!user.role && user.role === UserRole.ADMIN && user.isRoot) ?? false;
    }
    if (!!accessControl.role && accessControl.role !== UserRole.ADMIN) {
      return accessControl.role === user.role && accessControl.level <= user.status;
    }
    return (
      !!user.role &&
      user.role === UserRole.ADMIN &&
      !!user.permissions &&
      !!accessControl.rights &&
      accessControl.rights.every((grant) => user.permissions.includes(grant))
    );
  }
}
