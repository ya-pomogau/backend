/* eslint-disable func-names */
import { Prop, SchemaFactory, Schema } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { NotAcceptableException } from '@nestjs/common';
import { AdminDataDTO } from '../../../common/types/UsersDataDTO';
import { UserModel } from './user.schema';
import { AdminPermission, UserProfile, UserRole } from '../../../common/types/user.types';
import { HashService } from '../../../common/hash/hash.service';
import exceptions from '../../../common/constants/exceptions';

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

  @Prop({
    required: true,
  })
  isRoot: boolean;
}

interface AdminModelStatics extends Model<AdminRole> {
  checkAdminCredentials(login: string, password: string): Promise<AdminDataDTO> | null;
}

const AdminUserSchema = SchemaFactory.createForClass(AdminRole);

AdminUserSchema.pre('updateOne', { document: true, query: false }, function (next) {
  if (this.isRoot) {
    next(new NotAcceptableException(exceptions.users.notModified));
  }

  return next();
});

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
