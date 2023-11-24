/* import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, ObjectId } from 'mongoose';
import * as mongoose from 'mongoose';
import { ChatInterface, ChatType } from '../../../common/types/chats.types';
import { MessageSchema } from '../../../common/schemas/ ';

@Schema({
  timestamps: true,
  statics: {
    findPendingChats() {
      return this.find({
        taskId: { $ne: null },
        ownerId: { $eq: null },
      });
    },
  },
  virtuals: {
    chatType() {
      if (this.taskId === this.ownerId) {
        return ChatType.TASK_CHAT;
      }
      return null;
    },
  },
})
export class Chat extends Document implements ChatInterface {
  @Prop({ required: true, default: true, type: mongoose.SchemaTypes.Boolean })
  isOpen: boolean;

  @Prop({ default: [], type: [MessageSchema] })
  messages: MessageSchema[];

  @Prop({
    type: mongoose.SchemaTypes.ObjectId,
  })
  ownerId: ObjectId;

  @Prop({ type: mongoose.SchemaTypes.ObjectId })
  taskId: ObjectId;

  users: [ObjectId, ObjectId | null];
}

export const ChatSchema = SchemaFactory.createForClass<ChatInterface>(Chat);
*/
