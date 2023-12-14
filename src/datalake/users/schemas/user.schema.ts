/* eslint-disable no-use-before-define */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes } from 'mongoose';
import { UserProfileInterface, UserRole } from '../../../common/types/user.types';
import { UserProfileSchema } from '../../../common/schemas/user-profile.schema';

@Schema({
  timestamps: true,
  discriminatorKey: 'role',
  toObject: {
    versionKey: false,
    virtuals: true,
    flattenObjectIds: true,
  },
})
export class User extends Document {
  @Prop({ required: true, type: UserProfileSchema })
  profile: UserProfileInterface;

  @Prop({ required: true, unique: true, type: SchemaTypes.String })
  vkId: string;

  @Prop({
    type: SchemaTypes.String,
    required: true,
    enum: Object.values(UserRole),
  })
  role: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
