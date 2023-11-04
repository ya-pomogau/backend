import { Prop, SchemaFactory, Schema } from '@nestjs/mongoose';
import { UserProfile } from '../../../common/types/user.types';
import { UserStatus } from '../../../users/types';

@Schema()
export class RecipientRole {
  role: string;

  profile: UserProfile;

  vkID: string;

  @Prop({ required: true })
  status: UserStatus;
}

export const RecipientUserSchema = SchemaFactory.createForClass(RecipientRole);
