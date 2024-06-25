import { Prop, Schema, SchemaFactory, raw } from '@nestjs/mongoose';
import { type ObjectId, Document, SchemaTypes } from 'mongoose';
import { ChatType, ConflictChatWithRecipientInterface } from '../../../common/types/chats.types';
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
  implements ConflictChatWithRecipientInterface
{
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
    type: SchemaTypes.Boolean,
  })
  isActive: boolean;

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
  opponentChat: ObjectId | null;

  @Prop({
    required: false,
    default: null,
    type: raw(rawUserProfile),
  })
  admin: AdminInterface | null;
}

export const ConflictChatWithRecipientSchema =
  SchemaFactory.createForClass(ConflictChatWithRecipient);
