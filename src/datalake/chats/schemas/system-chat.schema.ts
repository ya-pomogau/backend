import { SchemaTypes } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { SystemChatModelInterface } from '../../../common/types/chats.types';
import { VolunteerInterface, RecipientInterface } from '../../../common/types/user.types';

@Schema({
  timestamps: true,
  toObject: {
    versionKey: false,
    virtuals: true,
    flattenObjectIds: true,
  },
})
export class SystemChat extends Document implements SystemChatModelInterface {
  @Prop({
    required: true,
    type: SchemaTypes.ObjectId,
  })
  user: VolunteerInterface | RecipientInterface;
}

export const SystemChatSchema = SchemaFactory.createForClass(SystemChat);
