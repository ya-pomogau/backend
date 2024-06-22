import { Prop, Schema, SchemaFactory, raw } from '@nestjs/mongoose';
import { type ObjectId, Document, SchemaTypes } from 'mongoose';
import { ConflictChatWithRecipientModelInterface } from '../../../common/types/chats.types';
import { RecipientInterface } from '../../../common/types/user.types';
import { rawUserProfile } from '../../../common/constants/mongoose-fields-raw-definition';

@Schema({
  timestamps: true,
  toObject: {
    versionKey: false,
    virtuals: true,
    flattenObjectIds: true,
  },
})
export class ConflictChatWithRecipient
  extends Document
  implements ConflictChatWithRecipientModelInterface
{
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
  recipient: RecipientInterface;

  @Prop({
    required: false,
    default: null,
    type: SchemaTypes.ObjectId,
  })
  volunteerChat: ObjectId;
}

export const ConflictChatWithRecipientSchema =
  SchemaFactory.createForClass(ConflictChatWithRecipient);
