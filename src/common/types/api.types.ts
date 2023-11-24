export interface VKLoginDtoInterface {
  code: string;
  redirectUri: string;
  state?: string;
}

export interface VKResponseInterface {
  access_token: string;
  user_id: number;
  expires_in: number;
  email: string;
}
