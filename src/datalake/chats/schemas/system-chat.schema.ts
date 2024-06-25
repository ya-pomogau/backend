import { SchemaTypes } from 'mongoose';
import { Prop, Schema, SchemaFactory, raw } from '@nestjs/mongoose';
import { ChatType, SystemChatInterface } from '../../../common/types/chats.types';
import {
  VolunteerInterface,
  RecipientInterface,
  AdminInterface,
} from '../../../common/types/user.types';
import { rawUserProfile } from '../../../common/constants/mongoose-fields-raw-definition';

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
    default: null,
    type: SchemaTypes.Date,
  })
  recipientLastReadAt: Date | null;

  @Prop({
    required: true,
    default: null,
    type: SchemaTypes.Date,
  })
  volunteerLastReadAt: Date | null;

  @Prop({
    required: true,
    default: null,
    type: SchemaTypes.Date,
  })
  adminLastReadAt: Date | null;

  @Prop({
    required: true,
    type: SchemaTypes.String,
  })
  type: ChatType;

  @Prop({
    required: true,
    type: SchemaTypes.Boolean,
  })
  isActive: boolean;

  @Prop({
    required: true,
    type: SchemaTypes.ObjectId,
  })
  user: VolunteerInterface | RecipientInterface;

  @Prop({
    required: false,
    default: null,
    type: raw(rawUserProfile),
  })
  admin: AdminInterface | null;
}

export const SystemChatSchema = SchemaFactory.createForClass(SystemChat);
