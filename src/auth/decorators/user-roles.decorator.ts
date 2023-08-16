import { SetMetadata } from '@nestjs/common';
import { UserRole } from '../../users/types';

export const ROLES_KEY = 'roles';
export const UserRoles = (...userRoles: UserRole[]) => SetMetadata(ROLES_KEY, userRoles);
