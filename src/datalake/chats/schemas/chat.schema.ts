import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, ObjectId, SchemaTypes } from 'mongoose';
import { ChatModelInterface, ChatType, ChatTypes } from '../../../common/types/chats.types';

@Schema({
  timestamps: true,
  discriminatorKey: 'type',
  toObject: {
    versionKey: false,
    virtuals: true,
    flattenObjectIds: true,
  },
})
export class Chat extends Document implements ChatModelInterface {
  @Prop({
    required: true,
    type: SchemaTypes.ObjectId,
  })
  _id: ObjectId;

  @Prop({
    required: true,
    type: SchemaTypes.String,
    enum: Object.values(ChatTypes),
  })
  type: ChatType;

  @Prop({
    required: true,
    type: SchemaTypes.Date,
  })
  createdAt: Date;

  @Prop({
    required: true,
    type: SchemaTypes.Date,
  })
  updatedAt: Date;

  @Prop({
    required: true,
    default: null,
    type: SchemaTypes.Date,
  })
  recipientLastReadAt: Date | null;

  @Prop({
    required: true,
    default: null,
    type: SchemaTypes.Date,
  })
  volunteerLastReadAt: Date | null;

  @Prop({
    required: true,
    default: null,
    type: SchemaTypes.Date,
  })
  adminLastReadAt: Date | null;

  @Prop({
    required: true,
    type: SchemaTypes.Boolean,
  })
  isActive: boolean;
}

export const ChatSchema = SchemaFactory.createForClass(Chat);
