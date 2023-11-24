import { EUserRole } from '../../users/types';
export declare const ROLES_KEY = "roles";
export declare const UserRoles: (...userRoles: EUserRole[]) => import("@nestjs/common").CustomDecorator<string>;
