import { Injectable, Scope, InternalServerErrorException } from '@nestjs/common';
import { ChatsRepository } from '../../datalake/chats/chats.repository';
import { MessagesRepository } from '../../datalake/messages/messages.repository';
import {
  MessageInterface,
  ConflictChatWithVolunteerInterface,
} from '../../common/types/chats.types';
import { TaskDto } from '../../common/dtos/tasks.dto';

export interface IConflictChatWithVolunteerEntity {
  createChat(metadata: TaskDto, messages: MessageInterface[]): Promise<this>;
  findChatByParams(params: Partial<ConflictChatWithVolunteerInterface>): Promise<this>;
  findConflictingChats(params: Partial<ConflictChatWithVolunteerInterface>): Promise<this>;
  addMessage(chatId: string, message: Partial<MessageInterface>): Promise<this>;
  closeChat(): Promise<this>;
}

@Injectable({ scope: Scope.REQUEST })
export class ConflictChatWithVolunteerEntity implements IConflictChatWithVolunteerEntity {
  private metadata: ConflictChatWithVolunteerInterface | null;
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

  async createChat(metadata: TaskDto): Promise<this> {
    const chatData = { ...metadata, isActive: true };
    const chat = (await this.chatsRepository.create(chatData)) as ConflictChatWithVolunteerInterface;
    if (!chat) {
      throw new InternalServerErrorException('Ошибка создания чата');
    }
    this.metadata = chat;
    this.chatId = chat._id;
    return this;
  }

  async findChatByParams(params: Partial<ConflictChatWithVolunteerInterface>): Promise<this> {
    const chats = (await this.chatsRepository.find(params)) as ConflictChatWithVolunteerInterface[];
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

  async findConflictingChats(params: Partial<ConflictChatWithVolunteerInterface>): Promise<this> {
    await this.findChatByParams(params);
    if (!this.metadata) {
      return this;
    }
    const { taskId, _id } = this.metadata;
    const conflictChats = (await this.chatsRepository.find({
      taskId,
      _id: { $ne: _id },
    })) as ConflictChatWithVolunteerInterface[];
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
      throw new InternalServerErrorException({
        message: 'Идентификатор чата не определён',
      });
    }
    const newMessage = (await this.messagesRepository.create({
      ...message,
      chatId,
    })) as MessageInterface;
    this.messages.push(newMessage);
    return this;
  }

  async closeChat(): Promise<this> {
    if (!this.chatId) {
      throw new InternalServerErrorException('Чат не найден');
    }
    const chat = await this.chatsRepository.findById(this.chatId);
    if (!chat) {
      throw new InternalServerErrorException('Чат не найден');
    }
    await this.chatsRepository.updateOne({ _id: this.chatId }, { isActive: false }, {});
    this.metadata.isActive = false;
    return this;
  }
}
