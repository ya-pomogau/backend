import { PointGeoJSONInterface } from './point-geojson.types';
import { CategoryInterface } from './category.types';
import { UserProfile } from './user.types';

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
  _id: string;
  recipient: UserProfile;
  volunteer: UserProfile | null;
  title: string;
  description?: string;
  date: Date | null;
  address: string;
  location: PointGeoJSONInterface;
  category: CategoryInterface;
  volunteerReport: ResolveStatus;
  recipientReport: ResolveStatus;
  adminResolve: ResolveStatus | null;
  isPendingChanges: boolean;
  // findWithin: (center: GeoCoordinates, distance: number) => Promise<Array<TaskInterface>>;
}

export interface TaskModelVirtuals {
  status: TaskStatus;
}
