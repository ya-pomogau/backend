import { PointGeoJSON } from '../schemas/PointGeoJSON.schema';
import { Category } from '../../datalake/category/schemas/category.schema';
import { ResolveStatus } from '../types/task.types';
import { UserProfile } from '../types/user.types';

export type TaskDto = {
  recipient: UserProfile;
  volunteer?: UserProfile | null;
  title: string;
  description?: string;
  date: Date | null;
  address: string;
  location: PointGeoJSON;
  category: Category;
  volunteerReport: ResolveStatus;
  recipientReport: ResolveStatus;
  adminResolve: ResolveStatus | null;
  isPendingChanges: boolean;
};

export type TasksDto = Array<TaskDto>;
