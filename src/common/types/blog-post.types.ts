import { UserProfile } from './user.types';

export interface BlogPostInterface {
  author: UserProfile;
  title: string;
  text: string;
  files?: string[];
}
