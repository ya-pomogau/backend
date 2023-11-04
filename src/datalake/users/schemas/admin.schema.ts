import { Prop, SchemaFactory, Schema } from '@nestjs/mongoose';
import { AdminPermission, UserProfile, UserRole } from '../../../common/types/user.types';
import { UserModel } from './user.schema';

@Schema()
export class AdminRole {
  role: string;

  profile: UserProfile;

  vkID: string;

  @Prop({
    type: {
      permissions: [AdminPermission],
      login: { type: String, unique: true },
      password: { type: String, select: false },
    },
  })
  administrative: {
    permissions: AdminPermission[];
    login: string;
    password: string;
  };
}

export const AdminUserSchema = SchemaFactory.createForClass(AdminRole);
export const AdminRoleUserModel = UserModel.discriminator(UserRole.ADMIN, AdminUserSchema);
