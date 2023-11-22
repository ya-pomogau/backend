import { UserProfileInterface } from './user.types';

export interface BlogPostInterface {
  author: UserProfileInterface;
  title: string;
  text: string;
  files?: string[];
}
