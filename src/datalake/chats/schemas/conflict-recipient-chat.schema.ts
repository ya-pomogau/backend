import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { type ObjectId, Document, SchemaTypes } from 'mongoose';
import { ConflictWithRecipientChatModelInterface } from '../../../common/types/chats.types';
import { RecipientInterface } from '../../../common/types/user.types';

@Schema({
  timestamps: true,
  toObject: {
    versionKey: false,
    virtuals: true,
    flattenObjectIds: true,
  },
})
export class ConflictWithRecipientChat
  extends Document
  implements ConflictWithRecipientChatModelInterface
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
  recipient: RecipientInterface;

  @Prop({
    required: true,
    type: SchemaTypes.ObjectId,
  })
  volunteerChat: ObjectId;
}

export const ConflictWithRecipientChatSchema =
  SchemaFactory.createForClass(ConflictWithRecipientChat);
