import { Injectable, Scope } from '@nestjs/common';
import { ChatsRepository } from '../../datalake/chats/chats.repository';
import { MessagesRepository } from '../../datalake/messages/messages.repository';
import { ChatInterface } from '../../common/types/chat.types';
import { MessageInterface } from '../../common/types/chats.types';
import { Types } from 'mongoose';

@Injectable({ scope: Scope.TRANSIENT })
export class ChatEntity {
  private chat: ChatInterface | null;
  private messages: MessageInterface[];

  constructor(
    private readonly chatsRepository: ChatsRepository,
    private readonly messagesRepository: MessagesRepository
  ) {
    this.chat = null;
    this.messages = [];
  }

  async createChat(
    metadata: Partial<ChatInterface>,
    messages: Partial<MessageInterface>[]
  ): Promise<ChatEntity> {
    const chat = await this.chatsRepository.create(metadata as any) as ChatInterface;
    this.chat = chat;
    if (messages.length > 0) {
      this.messages = await Promise.all(
        messages.map((message) =>
          this.messagesRepository.create({ ...message, chatId: chat._id } as any)
        )
      ) as MessageInterface[];
    } else {
      this.messages = [];
    }
    return this;
  }

  async findChatByParams(params: Partial<ChatInterface>): Promise<ChatEntity> {
    const chats = await this.chatsRepository.find(params) as ChatInterface[];
    if (chats.length > 0) {
      this.chat = chats[0];
      this.messages = await this.messagesRepository.find({ chatId: this.chat._id }) as MessageInterface[];
    }
    return this;
  }

  async findConflictingChats(params: Partial<ChatInterface>): Promise<ChatEntity> {
    const primaryChats = await this.findChatByParams(params);
    if (!primaryChats.chat) return this;

    const conflictChats = await this.chatsRepository.find({
      taskId: primaryChats.chat.taskId,
      ownerId: { $ne: primaryChats.chat.ownerId },
    }) as ChatInterface[];

    if (conflictChats.length > 0) {
      this.chat = conflictChats[0];
      this.messages = await this.messagesRepository.find({ chatId: this.chat._id }) as MessageInterface[];
    }

    return this;
  }

  async addMessage(chatId: string, message: Partial<MessageInterface>): Promise<ChatEntity> {
    const newMessage = await this.messagesRepository.create({
      ...message,
      chatId: new Types.ObjectId(chatId),
    } as any) as MessageInterface;
    
    if (this.chat && this.chat._id.toString() === chatId) {
      this.messages.push(newMessage);
    }

    return this;
  }

  async closeChat(chatId: string): Promise<ChatEntity> {
    const objectId = new Types.ObjectId(chatId);
    const chats = await this.chatsRepository.find({ _id: objectId }) as ChatInterface[];
    if (chats.length > 0) {
      await this.chatsRepository['model'].updateOne({ _id: objectId }, { isOpen: false }).exec();
      if (this.chat && this.chat._id.toString() === chatId) {
        this.chat.isOpen = false;
      }
    }
    return this;
  }
}
