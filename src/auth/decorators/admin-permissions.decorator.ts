import { SetMetadata } from '@nestjs/common';
import { AdminPermission, UserRole } from '../../users/types';

export const PERMISSIONS_KEY = 'permissions';
export const AdminPermissions = (...adminPermissions: AdminPermission[]) =>
  SetMetadata(PERMISSIONS_KEY, adminPermissions);
