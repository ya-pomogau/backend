import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { UserRole } from '../types/user.types';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';

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
    const accessControl = {
      role: this.reflector.get<string>('role', context.getHandler()),
      rights: this.reflector.get<Array<string>>('rights', context.getHandler()),
      level: this.reflector.get<number>('level', context.getHandler()),
      isRoot: this.reflector.get<boolean>('root', context.getHandler()) ?? false,
    };
    const { user } = context.switchToHttp().getRequest();
    if (accessControl.isRoot) {
      return (user.isRoot && user.role === UserRole.ADMIN) ?? false;
    }
    if (user.isRoot && user.role === UserRole.ADMIN) {
      return true;
    }
    if (accessControl.role !== UserRole.ADMIN) {
      return accessControl.role === user.role && accessControl.level <= user.status;
    }
    return (
      !!user.permissions && accessControl.rights.every((grant) => user.permissions.includes(grant))
    );
  }
}
