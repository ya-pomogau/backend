import { SchemaFactory, Schema } from '@nestjs/mongoose';
import { UserProfile } from '../../../common/types/user.types';

@Schema()
export class VisitorRole {
  role: string;

  profile: UserProfile;

  vkID: string;
}

export const VisitorUserSchema = SchemaFactory.createForClass(VisitorRole);
