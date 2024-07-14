import { Injectable, Scope } from '@nestjs/common';
import { ChatRepository } from './chats.repository';

@Injectable({ scope: Scope.TRANSIENT })
export class ChatEntity {
  private metadata: Record<string, any>[] = [];
  private messages: Record<string, any>[][] = [];

  constructor(private readonly chatRepository: ChatRepository) {}

  // Создание нового чата (кортежа конфликтных чатов)
  async createChat(metadata: Record<string, any>, messages: Record<string, any>[]) {
    const chat = await this.chatRepository.create(metadata);
    this.metadata.push(chat);
    this.messages.push(messages);
    return this;
  }

  // Поиск чата (массива чатов) по параметрам
  async findChatByParams(params: Record<string, any>, limit?: number) {
    const chats = await this.chatRepository.find(params, limit);
    this.metadata = chats;
    return this;
  }

  // Поиск кортежа (массива кортежей) конфликтных чатов по параметрам
  async findConflictingChats(params: Record<string, any>, limit?: number) {
    const chats = await this.chatRepository.findConflictChats(params, limit);
    this.metadata = chats;
    return this;
  }

  // Добавление сообщения в чат
  async addMessage(chatId: string, message: Record<string, any>) {
    const newMessage = await this.chatRepository.addMessage(chatId, message);
    const chatIndex = this.metadata.findIndex((chat) => chat.id === chatId);
    if (chatIndex !== -1) {
      this.messages[chatIndex].push(newMessage);
    }
    return this;
  }

  // Закрытие (деактивация/архивация) чата
  async closeChat(chatId: string) {
    await this.chatRepository.closeChat(chatId);
    const chatIndex = this.metadata.findIndex((chat) => chat.id === chatId);
    if (chatIndex !== -1) {
      this.metadata[chatIndex].active = false;
    }
    return this;
  }
}
