import { SchemaTypes } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ChatType, SystemChatInterface } from '../../../common/types/chats.types';
import {
  VolunteerInterface,
  RecipientInterface,
  AdminInterface,
} from '../../../common/types/user.types';

@Schema({
  timestamps: true,
  toObject: {
    versionKey: false,
    virtuals: true,
    flattenObjectIds: true,
  },
})
export class SystemChat extends Document implements SystemChatInterface {
  @Prop({
    required: true,
    type: SchemaTypes.String,
  })
  _id: string;

  @Prop({
    required: true,
    type: SchemaTypes.String,
  })
  createdAt: string;

  @Prop({
    required: true,
    type: SchemaTypes.String,
  })
  updatedAt: string;

  @Prop({
    required: true,
    type: SchemaTypes.String,
  })
  type: ChatType;

  @Prop({
    required: true,
    type: SchemaTypes.ObjectId,
  })
  user: VolunteerInterface | RecipientInterface;

  @Prop({
    required: true,
    type: SchemaTypes.ObjectId,
  })
  admin: AdminInterface;
}

export const SystemChatSchema = SchemaFactory.createForClass(SystemChat);
