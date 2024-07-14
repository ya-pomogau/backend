import { Injectable, Scope } from '@nestjs/common';
import { ChatsRepository } from '../../datalake/chats/chats.repository';
import { MessagesRepository } from '../../datalake/messages/messages.repository';
import { Chat } from '../../datalake/chats/schemas/chat.schema';
import { Message } from '../../datalake/messages/schemas/messages.schema';
import { Types } from 'mongoose';

@Injectable({ scope: Scope.TRANSIENT })
export class ChatEntity {
  private metadata: Chat[];
  private messages: Message[][];

  constructor(
    private readonly chatsRepository: ChatsRepository,
    private readonly messagesRepository: MessagesRepository
  ) {
    this.metadata = [];
    this.messages = [];
  }

  async createChat(metadata: Partial<Chat>, messages: Partial<Message>[]) {
    const chat = await this.chatsRepository.create(metadata);
    this.metadata.push(chat);
    this.messages.push(messages as Message[]);
    return this;
  }

  async findChatByParams(params: Record<string, any>) {
    const chats = await this.chatsRepository.find(params);
    this.metadata = chats;
    return this;
  }

  async findConflictingChats(params: Record<string, any>) {
    const chats = await this.chatsRepository.find(params);
    this.metadata = chats;
    return this;
  }

  async addMessage(chatId: string, message: Partial<Message>) {
    const newMessage = await this.messagesRepository.create({ ...message, chatId });
    const chatIndex = this.metadata.findIndex((chat) => chat._id.toString() === chatId);
    if (chatIndex !== -1) {
      if (!this.messages[chatIndex]) {
        this.messages[chatIndex] = [];
      }
      this.messages[chatIndex].push(newMessage);
    }
    return this;
  }

  async closeChat(chatId: string): Promise<ChatEntity> {
    const objectId = new Types.ObjectId(chatId);
    const chats = await this.chatsRepository.find({ _id: objectId }) as Chat[];
    if (chats.length > 0) {
      await this.chatsRepository['model'].updateOne({ _id: objectId }, { isActive: false }).exec();
      const chatIndex = this.metadata.findIndex((c) => c._id.toString() === chatId);
      if (chatIndex !== -1) {
        this.metadata[chatIndex].isActive = false;
      }
    }
    return this;
  }
}
