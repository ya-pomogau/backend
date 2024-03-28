/* import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, ObjectId } from 'mongoose';
import * as mongoose from 'mongoose';
import { UserProfile } from '../types/user.types';

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
export class UserProfile extends Document implements UserProfileInterface {
  @Prop({ required: false, type: mongoose.SchemaTypes.ObjectId })
  _id: string | ObjectId;

  @Prop({ required: true, type: mongoose.SchemaTypes.String })
  address: string;

  @Prop({ required: true, type: mongoose.SchemaTypes.String })
  avatar: string;

  @Prop({ required: true, type: mongoose.SchemaTypes.String })
  firstName: string;

  @Prop({ required: true, type: mongoose.SchemaTypes.String })
  lastName: string;

  @Prop({ required: true, type: mongoose.SchemaTypes.String })
  middleName: string;

  @Prop({ required: true, type: mongoose.SchemaTypes.String })
  phone: string;
}

export const UserProfileSchema = SchemaFactory.createForClass<UserProfileInterface>(UserProfile); */
