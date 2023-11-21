import { Prop, SchemaFactory, Schema } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { VolunteerDataDTO } from '../../../common/types/UsersDataDTO';
import { UserProfile, UserRole } from '../../../common/types/user.types';
import { UserStatus } from '../../../users/types';
import { PointGeoJSON } from '../../../common/schemas/PointGeoJSON.schema';

@Schema()
class VolunteerRole {
  @Prop({ default: 0 })
  score: number;

  @Prop({ required: true })
  status: UserStatus;

  @Prop({
    required: true,
    type: PointGeoJSON,
    index: '2dsphere',
  })
  location: PointGeoJSON;

  role: string;

  profile: UserProfile;

  vkID: string;
}

interface VolunteerModelStatics extends Model<VolunteerRole> {
  findVolunteerWithin(center: PointGeoJSON, distance: number): Promise<VolunteerDataDTO[]>;
}

const VolunteerUserSchema = SchemaFactory.createForClass(VolunteerRole);

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

const VolunteerModel = mongoose.model<VolunteerRole, VolunteerModelStatics>(
  'Volunteer',
  VolunteerUserSchema
);

export { VolunteerRole, VolunteerUserSchema, VolunteerModel };
