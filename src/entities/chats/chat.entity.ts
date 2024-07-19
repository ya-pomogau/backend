import { Injectable, Scope } from '@nestjs/common';
import { ChatsRepository } from '../../datalake/chats/chats.repository';
import { MessagesRepository } from '../../datalake/messages/messages.repository';
import { ChatInterface } from '../../common/types/chat.types';
import { MessageInterface } from '../../common/types/chats.types';
import { Types } from 'mongoose';

@Injectable({ scope: Scope.TRANSIENT })
export class ChatEntity {
  private metadata: ChatInterface[];
  private messages: { [chatId: string]: MessageInterface[] };

  constructor(
    private readonly chatsRepository: ChatsRepository,
    private readonly messagesRepository: MessagesRepository
  ) {
    this.metadata = [];
    this.messages = {};
  }

  async createChat(
    metadata: Partial<ChatInterface>,
    messages: Partial<MessageInterface>[]
  ): Promise<ChatEntity> {
    const chat = await this.chatsRepository.create(metadata as any) as ChatInterface;
    this.metadata.push(chat);
    if (messages.length > 0) {
      const savedMessages = await Promise.all(
        messages.map((message) =>
          this.messagesRepository.create({ ...message, chatId: chat._id } as any)
        )
      );
      this.messages[chat._id.toString()] = savedMessages as MessageInterface[];
    } else {
      this.messages[chat._id.toString()] = [];
    }
    return this;
  }

  async findChatByParams(params: Partial<ChatInterface>): Promise<ChatEntity> {
    const chats = await this.chatsRepository.find(params) as ChatInterface[];
    this.metadata = chats;
    this.messages = {}; // Сброс сообщений при новом поиске
    for (const chat of chats) {
      const chatMessages = await this.messagesRepository.find({ chatId: chat._id }) as MessageInterface[];
      this.messages[chat._id.toString()] = chatMessages;
    }
    return this;
  }

  async findConflictingChats(params: Partial<ChatInterface>): Promise<ChatEntity> {
    // Поиск чатов по типу
    const primaryChats = await this.findChatByParams(params);
    const conflictingChats: ChatInterface[] = [];
    this.metadata = primaryChats.metadata;
    this.messages = primaryChats.messages;
    // Поиск конфликтных чатов, которые указывают друг на друга
    for (const primaryChat of this.metadata) {
      const conflictChats = await this.chatsRepository.find({
        taskId: primaryChat.taskId,
        ownerId: { $ne: primaryChat.ownerId },
      }) as ChatInterface[];
      if (conflictChats.length > 0) {
        conflictingChats.push(...conflictChats);
      }
    }
    // Объединение найденных чатов и сообщений
    for (const conflictChat of conflictingChats) {
      const conflictMessages = await this.messagesRepository.find({ chatId: conflictChat._id }) as MessageInterface[];
      this.metadata.push(conflictChat);
      this.messages[conflictChat._id.toString()] = conflictMessages;
    }
    return this;
  }

  async addMessage(chatId: string, message: Partial<MessageInterface>): Promise<ChatEntity> {
    const newMessage = await this.messagesRepository.create({
      ...message,
      chatId: new Types.ObjectId(chatId),
    } as any);
    if (!this.messages[chatId]) {
      this.messages[chatId] = [];
    }
    this.messages[chatId].push(newMessage as MessageInterface);
    return this;
  }

  async closeChat(chatId: string): Promise<ChatEntity> {
    const objectId = new Types.ObjectId(chatId);
    const chats = await this.chatsRepository.find({ _id: objectId }) as ChatInterface[];
    if (chats.length > 0) {
      await this.chatsRepository['model'].updateOne({ _id: objectId }, { isOpen: false }).exec();
      const chatIndex = this.metadata.findIndex((c) => c._id.toString() === chatId);
      if (chatIndex !== -1) {
        this.metadata[chatIndex].isOpen = false;
      }
    }
    return this;
  }
}
