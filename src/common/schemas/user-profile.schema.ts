import { Schema, SchemaFactory } from '@nestjs/mongoose';
import { ObjectId } from 'mongoose';
import { UserProfileInterface } from '../types/user.types';

@Schema({
  timestamps: false,
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
  virtuals: {
    fullName: {
      get() {
        return `${this.firstName ? this.firstName : ''} ${this.middleName ? this.firstName : ''}  ${
          this.lastName ? this.lastName : ''
        }`;
      },
    },
  },
})
export class UserProfile implements UserProfileInterface {
  _id: string | ObjectId;

  address: string;

  avatar: string;

  firstName: string;

  lastName: string;

  middleName: string;

  phone: string;
}

export const UserProfileSchema = SchemaFactory.createForClass<UserProfileInterface>(UserProfile);
