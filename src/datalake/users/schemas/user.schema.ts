/* eslint-disable no-use-before-define */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, SchemaTypes } from 'mongoose';
import { GenericUserModelInterface, UserRole } from '../../../common/types/user.types';

@Schema({
  timestamps: true,
  discriminatorKey: 'role',
  toObject: {
    versionKey: false,
    virtuals: true,
    flattenObjectIds: true,
  },
  virtuals: {
    fullName: {
      get() {
        return `${this.firstName ? this.firstName : ''} ${this.middleName ? this.firstName : ''}  ${
          this.lastName ? this.lastName : ''
        }`;
      },
    },
    /*   profile: {
      get(): {
        const profile = { firstName: this.firstName, lastName: this.lastName, middleName:  }
        return
      }
    } */
  },
})
export class User extends Document implements GenericUserModelInterface {
  @Prop({ required: true, type: mongoose.SchemaTypes.String })
  address: string;

  @Prop({ default: '', type: mongoose.SchemaTypes.String })
  avatar: string;

  @Prop({ required: true, type: mongoose.SchemaTypes.String })
  firstName: string;

  @Prop({ required: true, type: mongoose.SchemaTypes.String })
  lastName: string;

  @Prop({ required: true, type: mongoose.SchemaTypes.String })
  middleName: string;

  @Prop({ required: true, type: mongoose.SchemaTypes.String })
  phone: string;

  @Prop({ required: true, unique: true, type: SchemaTypes.String })
  vkId: string;

  @Prop({
    type: SchemaTypes.String,
    required: true,
    enum: Object.values(UserRole),
  })
  role: string;
}

export const UserSchema = SchemaFactory.createForClass<GenericUserModelInterface>(User);
