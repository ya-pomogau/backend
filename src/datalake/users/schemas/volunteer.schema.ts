import { Prop, SchemaFactory, Schema } from '@nestjs/mongoose';
import { SchemaTypes, Document } from 'mongoose';
import { UserStatus } from '../../../users/types';
import { PointGeoJSON, PointGeoJSONSchema } from '../../../common/schemas/PointGeoJSON.schema';

@Schema({
  timestamps: true,
})
export class Volunteer extends Document {
  @Prop({ default: 0, type: SchemaTypes.Number })
  score: number;

  @Prop({
    type: SchemaTypes.String,
    required: true,
    enum: ['Unconfirmed', 'Confirmed', 'Verified', 'Activated'],
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

export const VolunteerUserSchema = SchemaFactory.createForClass(Volunteer);

/*
interface VolunteerModelStatics extends Model<VolunteerRole> {
  findVolunteerWithin(center: PointGeoJSON, distance: number): Promise<VolunteerDataDTO[]>;
}
// eslint-disable-next-line func-names
VolunteerUserSchema.statics.findVolunteerWithin = async function (
  center: PointGeoJSON,
  distance: number
): Promise<VolunteerDataDTO[]> {
  const volunteers = await this.find({
    location: {
      $geoWithin: { $center: [[...center.coordinates], distance] },
    },
    role: UserRole.VOLUNTEER,
  });
  return volunteers;
};

const VolunteerModel = model<VolunteerRole, VolunteerModelStatics>(
  'Volunteer',
  VolunteerUserSchema
);



export { VolunteerRole, VolunteerUserSchema, VolunteerModel };
 */
