import { Prop, Schema, SchemaFactory, raw } from '@nestjs/mongoose';
import { type ObjectId, Document, SchemaTypes } from 'mongoose';
import { ConflictChatWithVolunteerModelInterface } from '../../../common/types/chats.types';
import { VolunteerInterface } from '../../../common/types/user.types';
import { rawUserProfile } from '../../../common/constants/mongoose-fields-raw-definition';

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
    type: raw(rawUserProfile),
    immutable: true,
  })
  volunteer: VolunteerInterface;

  @Prop({
    required: false,
    default: null,
    type: SchemaTypes.ObjectId,
  })
  recipientChat: ObjectId;
}

export const ConflictChatWithVolunteerSchema =
  SchemaFactory.createForClass(ConflictChatWithVolunteer);
