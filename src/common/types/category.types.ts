import { UserStatus } from './user.types';

export interface CategoryInterface {
  title: string;
  points: number;
  accessLevel: UserStatus;
}
