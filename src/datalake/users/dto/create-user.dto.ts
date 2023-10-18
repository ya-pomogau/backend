import { PointGeoJSONDocument } from '../../../common/schemas/PointGeoJSON.schema';
import { UserRole, UserProfile } from '../../../common/types/user.types';
import { UserStatus, AdminPermission } from '../../../users/types';

export class CreateUserDto {
  role: UserRole;

  profile: UserProfile;

  vk_id: string;

  location: PointGeoJSONDocument;

  score: number | null;

  status: UserStatus;

  administrative: null | {
    permissions: AdminPermission[];
    login: string;
    password: string;
  };
}
