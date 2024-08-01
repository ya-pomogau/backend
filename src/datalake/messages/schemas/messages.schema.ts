import { Prop, raw, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes } from 'mongoose';
import { type ObjectId } from 'mongoose';
import { MessageInterface } from '../../../common/types/chats.types';
import { AnyUserInterface } from '../../../common/types/user.types';
import { rawUserProfile } from '../../../common/constants/mongoose-fields-raw-definition';

@Schema({
  timestamps: true,
  toObject: {
    versionKey: false,
    virtuals: true,
  },
})
export class Message extends Document implements MessageInterface {
  @Prop({ required: true, type: SchemaTypes.ObjectId })
  _id: ObjectId;

  @Prop({ required: true, type: SchemaTypes.String })
  title: string;

  @Prop({ required: true, type: SchemaTypes.String })
  body: string;

  @Prop({ required: false, default: [], type: [SchemaTypes.String] })
  attaches: string[];

  @Prop({ required: true, type: SchemaTypes.Date })
  createdAt: Date;

  @Prop({ required: true, type: raw(rawUserProfile) })
  author: AnyUserInterface;

  @Prop({ required: true, type: SchemaTypes.ObjectId })
  chatId: ObjectId;
}

export const MessagesSchema = SchemaFactory.createForClass(Message);
