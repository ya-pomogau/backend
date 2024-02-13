import { Prop, SchemaFactory, Schema } from '@nestjs/mongoose';
import { SchemaTypes, Document } from 'mongoose';
import { UserStatus, VolunteerUserModelInterface } from '../../../common/types/user.types';
import { PointGeoJSON, PointGeoJSONSchema } from '../../../common/schemas/PointGeoJSON.schema';

@Schema({
  timestamps: true,
})
export class Volunteer extends Document implements VolunteerUserModelInterface {
  @Prop({ default: 0, type: SchemaTypes.Number })
  score: number;

  @Prop({
    type: SchemaTypes.Number,
    required: true,
    enum: [-1, 0, 1, 2, 3],
  })
  status: UserStatus;

  @Prop({
    required: true,
    type: PointGeoJSONSchema,
    index: '2dsphere',
  })
  location: PointGeoJSON;

  @Prop({ required: false, default: false, type: SchemaTypes.Boolean })
  keys: boolean;
}

export const VolunteerUserSchema =
  SchemaFactory.createForClass<VolunteerUserModelInterface>(Volunteer);
