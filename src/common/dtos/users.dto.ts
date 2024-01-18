import { AdminPermission, UserProfile, UserRole } from '../types/user.types';
import { PointGeoJSON } from '../schemas/PointGeoJSON.schema';

export type CreateUserDto = {
  profile: Partial<UserProfile>;
  role: UserRole;
  vkId: string;
  location: PointGeoJSON;
  keys?: boolean;
  score?: number;
};

export type CreateAdminDto = CreateUserDto & {
  permissions: Array<AdminPermission>;
  login: string;
  password: string;
};
