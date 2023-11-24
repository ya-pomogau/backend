import { AdminPermission } from '../../users/types';
export declare const PERMISSIONS_KEY = "permissions";
export declare const AdminPermissions: (...adminPermissions: AdminPermission[]) => import("@nestjs/common").CustomDecorator<string>;
