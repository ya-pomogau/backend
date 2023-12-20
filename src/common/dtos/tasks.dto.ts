import { POJOType } from '../types/pojo.type';
import { UserProfile } from '../schemas/user-profile.schema';
import { PointGeoJSON } from '../schemas/PointGeoJSON.schema';
import { Category } from '../../datalake/category/schemas/category.schema';
import { ResolveStatus } from '../types/task.types';

export type TaskDto = {
  recipient: POJOType<UserProfile>;
  volunteer?: POJOType<UserProfile> | null;
  title: string;
  description?: string;
  date: Date | null;
  address: string;
  location: POJOType<PointGeoJSON>;
  category: POJOType<Category>;
  volunteerReport: ResolveStatus;
  recipientReport: ResolveStatus;
  adminResolve: ResolveStatus | null;
  isPendingChanges: boolean;
};

export type TasksDto = Array<TaskDto>;
