/* eslint-disable func-names */
/* eslint-disable no-use-before-define */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes } from 'mongoose';
import { AdminPermission, AdminUserModelInterface } from '../../../common/types/user.types';

@Schema({
  timestamps: true,
  toObject: {
    versionKey: false,
    virtuals: true,
    flattenObjectIds: true,
  },
  id: false,
})
export class Admin extends Document implements AdminUserModelInterface {
  @Prop({
    type: [{ type: SchemaTypes.String, enum: Object.values(AdminPermission) }],
    required: true,
    default: [],
  })
  permissions: AdminPermission[];

  @Prop({ type: SchemaTypes.String, unique: true, required: true })
  login: string;

  @Prop({ type: SchemaTypes.String, select: false, required: true })
  password: string;

  @Prop({
    required: false,
    default: null,
  })
  vkID: string | null;

  @Prop({
    required: true,
    type: SchemaTypes.Boolean,
    default: false,
    immutable: true,
  })
  isRoot: boolean;

  @Prop({
    required: true,
    type: SchemaTypes.Boolean,
    default: false,
  })
  isActive: boolean;
}

export const AdminUserSchema = SchemaFactory.createForClass<AdminUserModelInterface>(Admin);

/*
interface AdminModelStatics extends Model<AdminRole> {
  checkAdminCredentials(login: string, password: string): Promise<AdminDataDTO> | null;
}
AdminUserSchema.pre('updateOne', { document: true, query: false }, function (next) {
  if (this.isRoot) {
    next(new NotAcceptableException(exceptions.users.notModified));
  }

  return next();
});

AdminUserSchema.statics.getAdminByCredential = async function (
  login: string
): Promise<POJOType<AdminRole>> | null {
  return this.findOne({
    role: UserRole.ADMIN,
    administrative: { login },
  }).select('password');
};

const AdminRoleUserModel = UserModel.discriminator<AdminRole, AdminModelStatics>(
  UserRole.ADMIN,
  AdminUserSchema
);

export { AdminRoleUserModel, AdminUserSchema, AdminRole };


 */
