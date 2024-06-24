import { Prop, Schema, SchemaFactory, raw } from '@nestjs/mongoose';
import { type ObjectId, Document, SchemaTypes } from 'mongoose';
import { ChatType, TaskChatInterface } from '../../../common/types/chats.types';
import { RecipientInterface, VolunteerInterface } from '../../../common/types/user.types';
import { rawUserProfile } from '../../../common/constants/mongoose-fields-raw-definition';

@Schema({
  timestamps: true,
  toObject: {
    versionKey: false,
    virtuals: true,
    flattenObjectIds: true,
  },
})
export class TaskChat extends Document implements TaskChatInterface {
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
  taskId: ObjectId;

  @Prop({
    required: true,
    type: raw(rawUserProfile),
    immutable: true,
  })
  volunteer: VolunteerInterface;

  @Prop({
    required: true,
    type: raw(rawUserProfile),
    immutable: true,
  })
  recipient: RecipientInterface;
}

export const TaskChatSchema = SchemaFactory.createForClass(TaskChat);
