import { SetMetadata } from '@nestjs/common';
import { EUserRole } from '../../users/types';

export const ROLES_KEY = 'roles';
export const UserRoles = (...userRoles: EUserRole[]) => SetMetadata(ROLES_KEY, userRoles);
