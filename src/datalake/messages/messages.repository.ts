import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { BaseRepositoryService } from '../base-repository/base-repository.service';
import { Message } from './schemas/messages.schema';

@Injectable()
export class MessagesRepository extends BaseRepositoryService<Message> {
  constructor(@InjectModel(Message.name) private chatsModel: Model<Message>) {
    super(chatsModel);
  }
}
