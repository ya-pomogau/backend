import { UserProfile } from '../types/user.types';

export type PostDTO = {
  author: UserProfile;
  title: string;
  text: string;
  files: string[];
};
