import { Prop, SchemaFactory, Schema } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AdminDataDTO } from '../../../common/types/UsersDataDTO';
import { UserModel } from './user.schema';
import { AdminPermission, UserProfile, UserRole } from '../../../common/types/user.types';
import { HashService } from '../../../common/hash/hash.service';

@Schema()
class AdminRole {
  role: string;

  profile: UserProfile;

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

  @Prop({
    required: false,
  })
  vkID: string | null;
}

interface AdminModelStatics extends Model<AdminRole> {
  checkAdminCredentials(login: string, password: string): Promise<AdminDataDTO> | null;
}

const AdminUserSchema = SchemaFactory.createForClass(AdminRole);

// eslint-disable-next-line func-names
AdminUserSchema.statics.checkAdminCredentials = async function (
  login: string,
  password: string
): Promise<AdminDataDTO> | null {
  const hashService = new HashService();
  let comparePassword: boolean;
  const admin = await this.findOne({
    role: UserRole.ADMIN,
    administrative: { login },
  });
  if (admin) {
    comparePassword = await hashService.compareHash(password, admin.administrative.password);
  }
  if (comparePassword) {
    return admin.toObject();
  }
  return null;
};

const AdminRoleUserModel = UserModel.discriminator<AdminRole, AdminModelStatics>(
  UserRole.ADMIN,
  AdminUserSchema
);

export { AdminRoleUserModel, AdminUserSchema, AdminRole };
