import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { type ObjectId, Document, SchemaTypes } from 'mongoose';
import { ConflictWithVolunteerChatModelInterface } from '../../../common/types/chats.types';
import { RecipientInterface, VolunteerInterface } from '../../../common/types/user.types';

@Schema({
  timestamps: true,
  toObject: {
    versionKey: false,
    virtuals: true,
    flattenObjectIds: true,
  },
})
export class ConflictWithVolunteerChat
  extends Document
  implements ConflictWithVolunteerChatModelInterface
{
  @Prop({
    required: true,
    type: SchemaTypes.ObjectId,
  })
  taskId: ObjectId;

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

export const ConflictWithVolunteerChatSchema =
  SchemaFactory.createForClass(ConflictWithVolunteerChat);
