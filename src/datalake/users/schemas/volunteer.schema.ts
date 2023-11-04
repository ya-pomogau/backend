import { Prop, SchemaFactory, Schema } from '@nestjs/mongoose';
import { UserProfile } from '../../../common/types/user.types';
import { UserStatus } from '../../../users/types';
import { PointGeoJSON } from '../../../common/schemas/PointGeoJSON.schema';

@Schema()
export class VolunteerRole {
  role: string;

  profile: UserProfile;

  vkID: string;

  @Prop({ default: 0 })
  score: number;

  @Prop({ required: true })
  status: UserStatus;

  @Prop({
    required: true,
    type: PointGeoJSON,
    index: '2dsphere',
    default: { type: 'Point', coordinates: [0, 0] },
  })
  location: PointGeoJSON;
}

export const VolunteerUserSchema = SchemaFactory.createForClass(VolunteerRole);
