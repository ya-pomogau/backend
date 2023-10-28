import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export interface IPointGeoJSON {
  type: string;
  coordinates: number[];
}

@Schema()
export class PointGeoJSON implements IPointGeoJSON {
  @Prop({ required: true, enum: ['Point'], type: String })
  type: string;

  @Prop({ required: true, type: [Number] })
  coordinates: [longitude: number, latitude: number];
}

export const PointGeoJSONSchema = SchemaFactory.createForClass(PointGeoJSON);
export type PointGeoJSONDocument = HydratedDocument<PointGeoJSON>;
