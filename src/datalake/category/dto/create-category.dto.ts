import { UserStatus } from 'src/users/types';
import { ICategory } from '../schemas/category.shema';

export class CreateCategoryDto implements Omit<ICategory, 'createdAt' | 'updatedAt'> {
  title: string;
  points: number;
  accessLevel: UserStatus;
}
