import { SchemaFactory, Schema } from '@nestjs/mongoose';
import { UserProfile } from '../../../common/types/user.types';

@Schema()
export class MasterRole {
  role: string;

  profile: UserProfile;

  vkID: string;
}

export const MasterUserSchema = SchemaFactory.createForClass(MasterRole);
