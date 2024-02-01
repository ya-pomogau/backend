import { PointGeoJSONInterface } from '../types/point-geojson.types';

export type CreateTaskDto = {
  recipientId: string;
  title: string;
  description?: string;
  date: Date | null;
  address: string;
  location: PointGeoJSONInterface;
  categoryId: string;
};

export type GetTasksDto = {
  location: PointGeoJSONInterface;
  distance: number;
  categoryId?: string;
  start?: Date;
  end?: Date;
};
