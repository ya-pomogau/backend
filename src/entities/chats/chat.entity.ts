import { Injectable, Scope } from '@nestjs/common';
import { ChatsRepository } from '../../datalake/chats/chats.repository';
import { MessagesRepository } from '../../datalake/messages/messages.repository';

@Injectable({ scope: Scope.TRANSIENT })
export class ChatEntity {
  private metadata: any[];
  private messages: any[][];

  constructor(
    private readonly chatsRepository: ChatsRepository,
    private readonly messagesRepository: MessagesRepository
  ) {
    this.metadata = [];
    this.messages = [];
  }

  async createChat(metadata: Record<string, any>, messages: Record<string, any>[]) {
    const chat = await this.chatsRepository.create(metadata);
    this.metadata.push(chat);
    this.messages.push(messages);
    return this;
  }

  async findChatByParams(params: Record<string, any>) {
    const chats = await this.chatsRepository.find(params);
    this.metadata = chats;
    return this;
  }

  async findConflictingChats(params: Record<string, any>) {
    const chats = await this.chatsRepository.findConflictChats(params);
    this.metadata = chats;
    return this;
  }

  async addMessage(chatId: string, message: Record<string, any>) {
    const newMessage = await this.messagesRepository.addMessage(chatId, message);
    const chatIndex = this.metadata.findIndex((chat) => chat.id === chatId);
    if (chatIndex !== -1) {
      this.messages[chatIndex].push(newMessage);
    }
    return this;
  }

  async closeChat(chatId: string) {
    await this.chatsRepository.closeChat(chatId);
    const chatIndex = this.metadata.findIndex((chat) => chat.id === chatId);
    if (chatIndex !== -1) {
      this.metadata[chatIndex].active = false;
    }
    return this;
  }
}
