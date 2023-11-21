import { UserStatus } from '../../users/types';

export interface CategoryInterface {
  title: string;
  points: number;
  accessLevel: UserStatus;
}
