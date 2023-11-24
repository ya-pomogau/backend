/* eslint-disable no-shadow */
export const enum EVkUser {
  activities = 'activities',
  about = 'about',
  blacklisted = 'blacklisted',
  blacklisted_by_me = 'blacklisted_by_me',
  books = 'books',
  bdate = 'bdate',
  can_be_invited_group = 'can_be_invited_group',
  can_post = 'can_post',
  can_see_all_posts = 'can_see_all_posts',
  can_see_audio = 'can_see_audio',
  can_send_friend_request = 'can_send_friend_request',
  can_write_private_message = 'can_write_private_message',
  career = 'career',
  common_count = 'common_count',
  connections = 'connections',
  contacts = 'contacts',
  city = 'city',
  country = 'country',
  crop_photo = 'crop_photo',
  domain = 'domain',
  education = 'education',
  exports = 'exports',
  followers_count = 'followers_count',
  friend_status = 'friend_status',
  has_photo = 'has_photo',
  has_mobile = 'has_mobile',
  home_town = 'home_town',
  photo_100 = 'photo_100',
  photo_200 = 'photo_200',
  photo_200_orig = 'photo_200_orig',
  photo_400_orig = 'photo_400_orig',
  photo_50 = 'photo_50',
  sex = 'sex',
  site = 'site',
  schools = 'schools',
  screen_name = 'screen_name',
  status = 'status',
  verified = 'verified',
  games = 'games',
  interests = 'interests',
  is_favorite = 'is_favorite',
  is_friend = 'is_friend',
  is_hidden_from_feed = 'is_hidden_from_feed',
  last_seen = 'last_seen',
  maiden_name = 'maiden_name',
  military = 'military',
  movies = 'movies',
  music = 'music',
  nickname = 'nickname',
  occupation = 'occupation',
  online = 'online',
  personal = 'personal',
  photo_id = 'photo_id',
  photo_max = 'photo_max',
  quotes = 'quotes',
  relation = 'relation',
  relatives = 'relatives',
  timezone = 'timezone',
  tv = 'tv',
  universities = 'universities',
}

export const enum EVkNameCase {
  /**
   * именительный
   * default nom
   */
  nom = 'nom',
  // родительный
  gen = 'gen',
  // дательный
  dat = 'dat',
  // винительный
  acc = 'acc',
  // творительный
  ins = 'ins',
  // предложный
  abl = 'abl',
}

export interface IRequestUser {
  v: string;
  access_token?: string;
  name_case?: string;
  user_ids?: string;
  fields?: string;
}

export interface IVkUser {
  id: number;
  first_name: string;
  last_name: string;
  can_access_closed: boolean;
  is_closed: boolean;
  has_photo?: number;
  domain?: string;
  about?: string;
  photo_50?: string;
  photo_max: string;
  home_town: string;
  country: {
    id: number;
    title: string;
  };
}
