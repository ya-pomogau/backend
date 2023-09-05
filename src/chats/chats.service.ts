import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository } from 'typeorm';
import { ObjectId } from 'mongodb';
import { Chat } from './entities/chat.entity';

@Injectable()
export class ChatsService {
  constructor(
    @InjectRepository(Chat)
    private chatRepository: MongoRepository<Chat>
  ) {}

  async createChat(): Promise<Chat> {
    const chat = this.chatRepository.create({ messages: [] });
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

  // Этот метод удаляет чаты, которые истекли по времени (старше одного года)
  async deleteExpiredChats() {
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
    console.log(`Deleting chats older than: ${oneYearAgo.toISOString()}`);
    const result = await this.chatRepository.deleteMany({
      $and: [{ updatedAt: { $lt: oneYearAgo } }, { createdAt: { $lt: oneYearAgo } }],
    });
    console.log(`Delete result: ${JSON.stringify(result, null, 2)}`);
  }

  async deleteMessage(chatId: string, messageId: string): Promise<void> {
    const chat = await this.getChatById(chatId);
    if (!chat) {
      throw new NotFoundException('Chat not found');
    }
    if (chat) {
      // Найдем сообщение, которое нужно удалить, по его ID
      const messageIndex = chat.messages.findIndex((message) => message.id === messageId);
      if (messageIndex === -1) {
        throw new NotFoundException('Chat not found');
      }
      if (messageIndex !== -1) {
        // Удалим сообщение из массива
        chat.messages.splice(messageIndex, 1);
        // Сохраните обновленный чат в базу данных
        await this.chatRepository.save(chat);
      }
    }
  }
}
