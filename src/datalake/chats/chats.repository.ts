import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { BaseRepositoryService } from '../base-repository/base-repository.service';
import { Chats } from './schemas/chats.schema';

@Injectable()
export class ChatsRepository extends BaseRepositoryService<Chats> {
  constructor(@InjectModel(Chats.name) private chatsModel: Model<Chats>) {
    super(chatsModel);
  }
}
