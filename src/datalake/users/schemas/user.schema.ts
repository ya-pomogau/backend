import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { PointGeoJSONDocument } from '../../../common/schemas/PointGeoJSON.schema';
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

  @Prop({ required: true })
  vk_id: string;

  @Prop({ required: true })
  location: PointGeoJSONDocument;

  @Prop()
  score: number | null;

  @Prop({ required: true })
  status: UserStatus;

  @Prop()
  administrative: null | {
    permissions: AdminPermission[];
    login: string;
    password: string;
  };
}

export const UserSchema = SchemaFactory.createForClass(User);
export type UserDocument = HydratedDocument<User>;
