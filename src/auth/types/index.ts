import type { JwtPayload } from 'jsonwebtoken';
import type { User } from '../../users/entities/user.entity';

export interface ITokenResponse {
  access_token: string;
  expires_in: number;
  user_id: number;
}

export interface IJwtUser extends JwtPayload, User {
  accessToken?: string;
}
