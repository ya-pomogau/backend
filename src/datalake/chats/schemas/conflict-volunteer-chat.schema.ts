import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { type ObjectId, Document, SchemaTypes } from 'mongoose';
import { ConflictChatWithVolunteerModelInterface } from '../../../common/types/chats.types';
import { VolunteerInterface } from '../../../common/types/user.types';

@Schema({
  timestamps: true,
  toObject: {
    versionKey: false,
    virtuals: true,
    flattenObjectIds: true,
  },
})
export class ConflictChatWithVolunteer
  extends Document
  implements ConflictChatWithVolunteerModelInterface
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
  recipientChat: ObjectId;
}

export const ConflictChatWithVolunteerSchema =
  SchemaFactory.createForClass(ConflictChatWithVolunteer);
