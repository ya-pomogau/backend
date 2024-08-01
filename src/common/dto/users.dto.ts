import { AdminPermission, UserRole, UserStatus } from '../types/user.types';
import { PointGeoJSONInterface } from '../types/point-geojson.types';

export type CreateUserDto = {
  address: string;
  avatar?: string;
  name: string;
  phone: string;
  vkId: string;
  role: UserRole;
  status?: UserStatus;
  location?: PointGeoJSONInterface;
  keys?: boolean;
  score?: number;
};

export type CreateAdminDto = CreateUserDto & {
  permissions: Array<AdminPermission>;
  login: string;
  password: string;
  isRoot: false;
};
