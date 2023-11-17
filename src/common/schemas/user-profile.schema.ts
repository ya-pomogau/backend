import { Schema, SchemaFactory } from '@nestjs/mongoose';
import { ObjectId } from 'mongoose';
import { UserProfileInterface } from '../types/user.types';

@Schema({ timestamps: false })
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
