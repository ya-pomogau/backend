/* eslint-disable no-use-before-define */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, model, SchemaTypes } from 'mongoose';
import { UserProfileInterface, UserRole } from '../../../common/types/user.types';
import { UserProfileSchema } from '../../../common/schemas/user-profile.schema';
import { PointGeoJSON } from '../../../common/schemas/PointGeoJSON.schema';
import { POJOType } from '../../../common/types/pojo.type';
import { Admin } from './admin.schema';
import { HashService } from '../../../common/hash/hash.service';
import { Volunteer } from './volunteer.schema';
import { Recipient } from './recipient.schema';

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
    async checkAdminCredentials(login: string, password: string): Promise<POJOType<Admin>> | null {
      const user = this.findOne({
        role: UserRole.ADMIN,
        login,
      }).select('password');
      const isOk = HashService.compareHash(password, user.password);
      return isOk ? user : null;
    },
    async checkVKCredential(vkId: string): Promise<POJOType<Volunteer | Recipient>> | null {
      return this.findOne({
        vkID: vkId,
      });
    },
  },
  toObject: {
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
