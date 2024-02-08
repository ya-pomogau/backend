import { GeoCoordinates } from '../types/point-geojson.types';

export type CreateTaskDto = {
  recipientId: string;
  description?: string;
  date: Date | null;
  address: string;
  location: GeoCoordinates;
  categoryId: string;
};

export type GetTasksDto = {
  location: GeoCoordinates;
  distance: number;
  categoryId?: string;
  start?: Date;
  end?: Date;
};
