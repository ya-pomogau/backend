import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ObjectId } from 'mongodb';
import { Chat } from './entities/chat.entity';

@Injectable()
export class ChatsService {
  constructor(
    @InjectRepository(Chat)
    private chatRepository: Repository<Chat>
  ) {}

  async createChat(name: string): Promise<Chat> {
    const chat = this.chatRepository.create({ name, messages: [] });
    return this.chatRepository.save(chat);
  }

  async getChatById(id: string): Promise<Chat | undefined> {
    const _id = new ObjectId(id);
    const chat = await this.chatRepository.findOne({
      where: { _id },
    });
    if (!chat) {
      throw new NotFoundException('Chat not found');
    }
    return chat;
  }
}
