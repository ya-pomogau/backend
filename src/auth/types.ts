/* eslint-disable no-shadow */

export const enum EDisplay {
  page = 'page',
  popup = 'popup',
  mobile = 'mobile',
}

export const enum EScope {
  notify = 'notify',
  friends = 'friends',
  photos = 'photos',
  audio = 'audio',
  video = 'video',
  stories = 'stories',
  pages = 'pages',
  menu = 'menu',
  status = 'status',
  notes = 'notes',
  messages = 'messages',
  wall = 'wall',
  ads = 'ads',
  offline = 'offline',
  docs = 'docs',
  groups = 'groups',
  notifications = 'notifications',
  stats = 'stats',
  email = 'email',
  market = 'market',
  phone_number = 'phone_number',
}

export const enum EResponseType {
  code = 'code',
  token = 'token',
}

export interface ITokenResponse {
  access_token: string;
  expires_in: string;
  user_id: number;
}

export interface IJwtUser {
  sub: string;
  vkId: number;
  role: string;
  accessToken: string;
}
