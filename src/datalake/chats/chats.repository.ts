import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { BaseRepositoryService } from '../base-repository/base-repository.service';
import { Chat } from './schemas/chat.schema';

@Injectable()
export class ChatsRepository extends BaseRepositoryService<Chat> {
  constructor(@InjectModel(Chat.name) private chatModel: Model<Chat>) {
    super(chatModel);
  }

  async findConflictChats(params: Record<string, any>): Promise<Chat[]> {
    return this.chatModel.find(params).exec();
  }

  async closeChat(chatId: string): Promise<void> {
    await this.chatModel.updateOne({ _id: chatId }, { active: false }).exec();
  }
}
