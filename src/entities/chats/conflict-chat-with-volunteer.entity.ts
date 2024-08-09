import { Injectable, Scope, InternalServerErrorException } from '@nestjs/common';
import { ChatsRepository } from '../../datalake/chats/chats.repository';
import { MessagesRepository } from '../../datalake/messages/messages.repository';
import {
  MessageInterface,
  ConflictChatWithVolunteerInterface,
} from '../../common/types/chats.types';
import { TaskDto } from '../../common/dtos/tasks.dto';

export interface IConflictChatWithVolunteerEntity {
  chatId: string;
  meta: ConflictChatWithVolunteerInterface | null;
  messages: MessageInterface[];
  toObject(): { metadata: ConflictChatWithVolunteerInterface | null; messages: MessageInterface[] };
  getMessages(skip: number, limit?: number): Promise<MessageInterface[]>;
  createChat(metadata: TaskDto, messages?: MessageInterface[]): Promise<this>;
  findChatByParams(params: Partial<ConflictChatWithVolunteerInterface>): Promise<this>;
  findConflictingChats(params: Partial<ConflictChatWithVolunteerInterface>): Promise<this>;
  addMessage(chatId: string, message: Partial<MessageInterface>): Promise<this>;
  closeChat(): Promise<this>;
}

@Injectable({ scope: Scope.REQUEST })
export class ConflictChatWithVolunteerEntity implements IConflictChatWithVolunteerEntity {
  private _meta: ConflictChatWithVolunteerInterface | null;
  private _messages: MessageInterface[];
  private _chatId: string;

  constructor(
    private readonly chatsRepository: ChatsRepository,
    private readonly messagesRepository: MessagesRepository
  ) {
    this._meta = null;
    this._messages = [];
    this._chatId = '';
  }

  get chatId(): string {
    return this._chatId;
  }

  get meta(): ConflictChatWithVolunteerInterface | null {
    return this._meta;
  }

  get messages(): MessageInterface[] {
    return this._messages;
  }

  toObject(): {
    metadata: ConflictChatWithVolunteerInterface | null;
    messages: MessageInterface[];
  } {
    return {
      metadata: this._meta,
      messages: [], // Пока не знаю, кортеж с какими массивами должен быть
    };
  }

  async getMessages(skip: number, limit: number = 20): Promise<MessageInterface[]> {
    if (!this._chatId) {
      throw new InternalServerErrorException('Чат не найден');
    }
    const messages = (await this.messagesRepository.find(
      {
        chatId: this._chatId,
      },
      null,
      {
        skip,
        limit,
      }
    )) as MessageInterface[];
    this._messages = messages;
    return messages;
  }

  async createChat(metadata: TaskDto): Promise<this> {
    const chatData = { ...metadata, isActive: true };
    const chat = (await this.chatsRepository.create(
      chatData
    )) as ConflictChatWithVolunteerInterface;
    if (!chat) {
      throw new InternalServerErrorException('Ошибка создания чата');
    }
    this._meta = chat;
    this._chatId = chat._id;
    return this;
  }

  async findChatByParams(params: Partial<ConflictChatWithVolunteerInterface>): Promise<this> {
    const chats = (await this.chatsRepository.find(params)) as ConflictChatWithVolunteerInterface[];
    if (chats.length > 0) {
      this._meta = chats[0];
      this._messages = (await this.messagesRepository.find({
        chatId: this._meta._id,
      })) as MessageInterface[];
    } else {
      this._meta = null;
      this._messages = [];
    }
    return this;
  }

  async findConflictingChats(params: Partial<ConflictChatWithVolunteerInterface>): Promise<this> {
    await this.findChatByParams(params);
    if (!this._meta) {
      return this;
    }
    const { taskId, _id } = this._meta;
    const conflictChats = (await this.chatsRepository.find({
      taskId,
      _id: { $ne: _id },
    })) as ConflictChatWithVolunteerInterface[];
    if (conflictChats.length > 0) {
      this._meta = conflictChats[0];
      this._messages = (await this.messagesRepository.find({
        chatId: this._meta._id,
      })) as MessageInterface[];
    }
    return this;
  }

  async addMessage(chatId: string, message: Partial<MessageInterface>): Promise<this> {
    if (!this._chatId) {
      throw new InternalServerErrorException({
        message: 'Идентификатор чата не определён',
      });
    }
    const newMessage = (await this.messagesRepository.create({
      ...message,
      chatId,
    })) as MessageInterface;
    this._messages.push(newMessage);
    return this;
  }

  async closeChat(): Promise<this> {
    if (!this._chatId) {
      throw new InternalServerErrorException('Чат не найден');
    }
    const chat = await this.chatsRepository.findById(this._chatId);
    if (!chat) {
      throw new InternalServerErrorException('Чат не найден');
    }
    await this.chatsRepository.updateOne({ _id: this._chatId }, { isActive: false }, {});
    this._meta.isActive = false;
    return this;
  }
}
