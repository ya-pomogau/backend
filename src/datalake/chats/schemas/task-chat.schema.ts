import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes } from 'mongoose';
import { TaskChatModelInterface } from '../../../common/types/chats.types';
import { RecipientInterface, VolunteerInterface } from '../../../common/types/user.types';

@Schema({
  timestamps: true,
  toObject: {
    versionKey: false,
    virtuals: true,
    flattenObjectIds: true,
  },
})
export class TaskChat extends Document implements TaskChatModelInterface {
  @Prop({
    required: true,
    type: SchemaTypes.ObjectId,
  })
  volunteer: VolunteerInterface;

  @Prop({
    required: true,
    type: SchemaTypes.ObjectId,
  })
  recipient: RecipientInterface;
}

export const TaskChatSchema = SchemaFactory.createForClass(TaskChat);
