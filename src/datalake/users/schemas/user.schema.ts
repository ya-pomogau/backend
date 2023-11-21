/* eslint-disable no-use-before-define */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, model, SchemaTypes } from 'mongoose';
import { UserProfileInterface, UserRole } from '../../../common/types/user.types';
import { UserProfileSchema } from '../../../common/schemas/user-profile.schema';
import { PointGeoJSON } from '../../../common/schemas/PointGeoJSON.schema';
import { POJOType } from '../../../common/types/pojo.type';
import { Admin } from './admin.schema';

@Schema({
  timestamps: true,
  discriminatorKey: 'role',
  statics: {
    async findVolunteersWithin(
      center: PointGeoJSON,
      distance: number
    ): Promise<Array<POJOType<User>>> {
      return this.find({
        location: {
          $geoWithin: { $center: [[...center.coordinates], distance] },
        },
        role: UserRole.VOLUNTEER,
      });
    },
    async checkAdminCredentials(login: string): Promise<POJOType<Admin>> {
      return this.findOne({
        role: UserRole.ADMIN,
        administrative: { login },
      }).select('password');
    },
  },
  toObject: {
    transform(doc, ret) {
      // Из transform запрещено возвращать значение, это требование самого Mongoose
      // Необходимо изменять именно параметр ret.
      // eslint-disable-next-line no-param-reassign
      delete ret._id;
    },
    versionKey: false,
    virtuals: true,
  },
})
export class User extends Document {
  @Prop({ required: true, type: UserProfileSchema })
  profile: UserProfileInterface;

  @Prop({ required: true, unique: true, type: SchemaTypes.String })
  vkID: string;

  @Prop({
    type: SchemaTypes.String,
    required: true,
    enum: Object.values(UserRole),
  })
  role: string;
}

export const UserSchema = SchemaFactory.createForClass(User);

export const UserModel = model('User', UserSchema);
