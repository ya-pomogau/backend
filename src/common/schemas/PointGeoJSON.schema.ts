import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { PointGeoJSONInterface } from '../types/point-geojson.types';

@Schema({
  timestamps: true,
  toObject: {
    transform(doc, ret) {
      // Из transform запрещено возвращать значение, это требование самого Mongoose
      // Необходимо изменять именно параметр ret.
      // eslint-disable-next-line no-param-reassign
      delete ret._id;
    },
    versionKey: false,
    virtuals: true,
  },
})
export class PointGeoJSON implements PointGeoJSONInterface {
  @Prop({ required: true, enum: ['Point'] })
  type: string;

  @Prop({ required: true, type: [Number] })
  coordinates: number[];
}

export const PointGeoJSONSchema = SchemaFactory.createForClass(PointGeoJSON);
