import { PointGeoJSON } from '../../../common/schemas/PointGeoJSON.schema';
import { UserRole, UserProfile } from '../../../common/types/user.types';
import { UserStatus, AdminPermission } from '../../../users/types';

export class CreateUserDto {
  role: UserRole;

  profile: UserProfile;

  vkID: string;

  location: PointGeoJSON;

  score: number | null;

  status: UserStatus;

  administrative: null | {
    permissions: AdminPermission[];
    login: string;
    password: string;
  };
}
