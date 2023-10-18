import { UserStatus } from 'src/users/types';

export class CreateCategoryDto {
  title: string;
  points: number;
  accessLevel: UserStatus;
  createdAt: Date;
  updatedAt: Date;
}
