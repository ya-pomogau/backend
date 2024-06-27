import { Prop, Schema, SchemaFactory, raw } from '@nestjs/mongoose';
import { type ObjectId, Document, SchemaTypes } from 'mongoose';
import { ConflictChatWithRecipientModelInterface } from '../../../common/types/chats.types';
import { AdminInterface, RecipientInterface } from '../../../common/types/user.types';
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
    type: raw(rawUserProfile),
    immutable: true,
  })
  recipient: RecipientInterface;

  @Prop({
    required: true,
    default: null,
    type: SchemaTypes.Date,
  })
  recipientLastReadAt: Date | null;

  @Prop({
    required: true,
    type: SchemaTypes.ObjectId,
  })
  taskId: ObjectId;

  @Prop({
    required: false,
    default: null,
    type: SchemaTypes.ObjectId,
  })
  opponentChat: ObjectId | null;

  @Prop({
    required: false,
    default: null,
    type: raw(rawUserProfile),
  })
  admin: AdminInterface | null;

  @Prop({
    required: true,
    default: null,
    type: SchemaTypes.Date,
  })
  adminLastReadAt: Date | null;
}

export const ConflictChatWithRecipientSchema =
  SchemaFactory.createForClass(ConflictChatWithRecipient);
