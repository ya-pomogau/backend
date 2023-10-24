import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

@Schema()
export class PointGeoJSON {
  @Prop({ required: true, enum: ['Point'] })
  type: string;

  @Prop({ required: true, type: [Number] })
  coordinates: number[];
}

export const PointGeoJSONSchema = SchemaFactory.createForClass(PointGeoJSON);
export type PointGeoJSONDocument = HydratedDocument<PointGeoJSON>;
