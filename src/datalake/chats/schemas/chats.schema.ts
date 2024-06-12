import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes } from 'mongoose';
import { type ObjectId } from 'mongoose';
import { ChatsInterface } from '../../../common/types/chats.types';
import { AnyUserInterface } from '../../../common/types/user.types';

@Schema({ timestamps: true })
export class Chats extends Document implements ChatsInterface {
  @Prop({ required: true, type: SchemaTypes.ObjectId })
  _id: ObjectId;

  @Prop({ required: true, type: SchemaTypes.String })
  title: string;

  @Prop({ required: true, type: SchemaTypes.String })
  body: string;

  @Prop({ required: false, default: [], type: [String] })
  attaches: string[];

  @Prop({ required: true, type: SchemaTypes.Date })
  createdAt: Date;

  @Prop({ required: true })
  author: AnyUserInterface;

  @Prop({ required: true, type: SchemaTypes.ObjectId })
  chatId: ObjectId;
}

export const ChatsSchema = SchemaFactory.createForClass(Chats);
