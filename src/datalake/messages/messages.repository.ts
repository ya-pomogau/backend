import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { BaseRepositoryService } from '../base-repository/base-repository.service';
import { Message } from './schemas/messages.schema';

@Injectable()
export class MessagesRepository extends BaseRepositoryService<Message> {
  constructor(@InjectModel(Message.name) private messageModel: Model<Message>) {
    super(messageModel);
  }

  async addMessage(chatId: string, message: Record<string, any>): Promise<Message> {
    const createdMessage = new this.messageModel({ ...message, chatId });
    return createdMessage.save();
  }
}
