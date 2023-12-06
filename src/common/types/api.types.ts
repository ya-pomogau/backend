import { UserProfileInterface, UserRole } from './user.types';
import { PointGeoJSONInterface } from './point-geojson.types';

export interface VKLoginDtoInterface {
  code: string;
  redirectUrl: string;
  state?: string;
}

interface VKResponseOKInterface {
  access_token: string;
  user_id: number;
  expires_in: number;
  email: string;
}

interface VKResponseErrorInterface {
  error: string;
  error_description: string;
}

export interface VKResponseInterface extends VKResponseOKInterface, VKResponseErrorInterface {}

export interface VKNewUserProfileInterface {
  firstName: string;
  middleName?: string;
  lastName: string;
  phone: string;
  avatar?: string;
  address: string;
}

export interface VKNewUserInterface {
  profile: Partial<UserProfileInterface>;
  role: UserRole;
  vkId: string;
  location?: PointGeoJSONInterface;
}
