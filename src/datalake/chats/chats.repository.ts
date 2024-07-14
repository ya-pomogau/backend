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
}
