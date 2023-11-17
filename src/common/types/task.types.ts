import { ObjectId } from 'mongoose';
import { UserProfileInterface } from './user.types';
import { IPointGeoJSON } from '../schemas/geoJson.schema';
import { ICategory } from '../../datalake/category/schemas/category.shema';

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
  recipient: UserProfileInterface;
  volunteer: UserProfileInterface;
  title: string;
  description?: string;
  date: Date | null;
  address: string;
  location: IPointGeoJSON;
  category: ICategory & { _id: string | ObjectId };
  volunteerReport: ResolveStatus;
  recipientReport: ResolveStatus;
  adminResolve: ResolveStatus | null;
  isPendingChanges: boolean;
}
