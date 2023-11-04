import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { UserProfile, UserRole } from '../../../common/types/user.types';

@Schema({ timestamps: true, discriminatorKey: 'role' })
export class User {
  @Prop({ required: true })
  profile: UserProfile;

  @Prop({ required: true, unique: true })
  vkID: string;

  @Prop({
    type: String,
    required: true,
    enum: Object.values(UserRole),
  })
  role: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
export type UserDocument = HydratedDocument<User>;
export const UserModel = mongoose.model('User', UserSchema);
