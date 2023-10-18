import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { PointGeoJSON } from '../../../common/schemas/PointGeoJSON.schema';
import {
  AdminPermission,
  UserProfile,
  UserStatus,
  UserRole,
} from '../../../common/types/user.types';

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true })
  role: UserRole;

  @Prop({ required: true })
  profile: UserProfile;

  @Prop({ required: true, unique: true })
  vkID: string;

  @Prop({ required: true, type: PointGeoJSON, index: '2dsphere' })
  location: PointGeoJSON;

  @Prop()
  score: number;

  @Prop({ required: true })
  status: UserStatus;

  @Prop({
    type: {
      permissions: [AdminPermission],
      login: { type: String, unique: true },
      password: String,
    },
  })
  administrative: {
    permissions: AdminPermission[];
    login: string;
    password: string;
  };
}

export const UserSchema = SchemaFactory.createForClass(User);
export type UserDocument = HydratedDocument<User>;
