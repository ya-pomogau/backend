import { POJOType } from './pojo.type';
import { Category } from '../../datalake/category/schemas/category.schema';
import { PointGeoJSON } from '../schemas/PointGeoJSON.schema';
import { UserProfile } from '../schemas/user-profile.schema';

export enum TaskStatus {
  CREATED = 'created',
  ACCEPTED = 'accepted',
  COMPLETED = 'completed',
  CONFLICTED = `conflicted`,
}

export enum ResolveStatus {
  VIRGIN = 'virgin',
  PENDING = 'pending',
  FULFILLED = 'fulfilled',
  REJECTED = 'rejected',
}

export interface TaskInterface {
  recipient: POJOType<UserProfile>;
  volunteer: POJOType<UserProfile>;
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
}
