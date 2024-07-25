import { Injectable, Scope } from '@nestjs/common';
import { ChatsRepository } from '../../datalake/chats/chats.repository';
import { MessagesRepository } from '../../datalake/messages/messages.repository';
import { MessageInterface, TaskChatInterface } from '../../common/types/chats.types';
import { Types } from 'mongoose';

export interface ITasksChatEntity {
  createChat(metadata: Partial<TaskChatInterface>, messages: MessageInterface[]): Promise<this>;
  findChatByParams(params: Partial<TaskChatInterface>): Promise<this>;
  findConflictingChats(params: Partial<TaskChatInterface>): Promise<this>;
  addMessage(chatId: string, message: Partial<MessageInterface>): Promise<this>;
  closeChat(): Promise<this>;
}

@Injectable({ scope: Scope.TRANSIENT })
export class TasksChatEntity {
  private metadata: TaskChatInterface | null;
  private messages: MessageInterface[];
  private chatId: string;

  constructor(
    private readonly chatsRepository: ChatsRepository,
    private readonly messagesRepository: MessagesRepository
  ) {
    this.metadata = null;
    this.messages = [];
    this.chatId = '';
  }

  async createChat(
    metadata: Partial<TaskChatInterface>,
    messages: MessageInterface[]
  ): Promise<this> {
    const chat = (await this.chatsRepository.create(metadata)) as TaskChatInterface;
    this.metadata = chat;
    this.chatId = chat._id;
    if (messages.length > 0 && chat) {
      const savedMessages = await Promise.all(
        messages.map((message) =>
          this.messagesRepository.create({ ...message, chatId: this.chatId })
        )
      );
      this.messages = savedMessages;
    } else {
      this.messages = [];
    }
    return this;
  }

  async findChatByParams(params: Partial<TaskChatInterface>): Promise<this> {
    const chats = (await this.chatsRepository.find(params)) as TaskChatInterface[];
    if (chats.length > 0) {
      this.metadata = chats[0];
      this.messages = (await this.messagesRepository.find({
        chatId: this.metadata._id,
      })) as MessageInterface[];
    } else {
      this.metadata = null;
      this.messages = [];
    }
    return this;
  }

  async findConflictingChats(params: Partial<TaskChatInterface>): Promise<this> {
    await this.findChatByParams(params);
    if (!this.metadata) {
      return this;
    }
    const { taskId, _id } = this.metadata;
    const conflictChats = (await this.chatsRepository.find({
      taskId,
      _id: { $ne: _id },
    })) as TaskChatInterface[];
    if (conflictChats.length > 0) {
      this.metadata = conflictChats[0];
      this.messages = (await this.messagesRepository.find({
        chatId: this.metadata._id,
      })) as MessageInterface[];
    }
    return this;
  }

  async addMessage(chatId: string, message: Partial<MessageInterface>): Promise<this> {
    if (!this.chatId) {
      throw new Error('Chat ID is not set');
    }
    const newMessage = (await this.messagesRepository.create({
      ...message,
      chatId: new Types.ObjectId(chatId),
    })) as MessageInterface;
    this.messages.push(newMessage);
    return this;
  }

  async closeChat(): Promise<this> {
    const chats = (await this.chatsRepository.find({ _id: this.chatId })) as TaskChatInterface[];
    if (chats.length > 0) {
      await this.chatsRepository['model']
        .updateOne({ _id: this.chatId }, { isActive: false })
        .exec();
      this.metadata.isActive = false;
    }
    return this;
  }
}
