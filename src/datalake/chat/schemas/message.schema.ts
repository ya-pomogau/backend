import { Document, ObjectId } from 'mongoose';
import { Prop, Schema } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { MessageInterface } from '../../../common/types/chat.types';

@Schema({ timestamps: true })
export class MessageSchema extends Document implements MessageInterface {
  @Prop({ type: [mongoose.SchemaTypes.String] })
  attach: string[];

  @Prop({ type: mongoose.SchemaTypes.ObjectId, required: true })
  author: ObjectId;

  @Prop({ type: mongoose.SchemaTypes.String, required: true })
  body: string;

  @Prop({ type: mongoose.SchemaTypes.Number })
  timestamp: number;

  @Prop({ type: mongoose.SchemaTypes.String })
  title: string;
}
