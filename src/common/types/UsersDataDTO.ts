import mongoose from 'mongoose';
import { PointGeoJSON } from '../schemas/PointGeoJSON.schema';
import { UserProfile, UserStatus, AdminPermission } from './user.types';

export interface UserDataDTO {
  _id?: mongoose.Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
  role: string;
  profile: UserProfile;
  vkID: string;
}

export interface AdminDataDTO extends UserDataDTO {
  administrative: {
    permissions: AdminPermission[];
    login: string;
    password: string;
  };
}

export interface VolunteerDataDTO extends UserDataDTO {
  score: number;
  location: PointGeoJSON;
  status: UserStatus;
}

export interface RecipientDataDTO extends UserDataDTO {
  status: UserStatus;
}

export type VisitorDataDTO = UserDataDTO;

export type AdminDataDTOWithoutPassword = Omit<AdminDataDTO, 'administrative'> & {
  administrative: Omit<AdminDataDTO['administrative'], 'password'>;
};
