import { PointGeoJSON } from '../schemas/PointGeoJSON.schema';
import {
  UserRole,
  UserProfile,
  UserStatus,
  AdminPermission,
} from './user.types';

export interface UserDataDTO {
  _id?: string;
  createdAt?: Date;
  updatedAt?: Date;
  role: UserRole;
  profile: UserProfile;
  vkID: string;
  location: PointGeoJSON;
  score: number;
  status: UserStatus;
  administrative: {
    permissions: AdminPermission[];
    login: string;
    password: string;
  };
}

export type UserDataDTOWithoutPassword = Omit<UserDataDTO, 'administrative'> & {
  administrative: Omit<UserDataDTO['administrative'], 'password'>;
};
