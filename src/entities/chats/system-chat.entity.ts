import { Injectable, Scope, InternalServerErrorException } from '@nestjs/common';
import { ChatsRepository } from '../../datalake/chats/chats.repository';
import { MessagesRepository } from '../../datalake/messages/messages.repository';
import { MessageInterface, SystemChatInterface } from '../../common/types/chats.types';
import { TaskDto } from '../../common/dtos/tasks.dto';

export interface ISystemChatEntity {
  chatId: string;
  meta: SystemChatInterface | null;
  messages: MessageInterface[];
  toObject(): { metadata: SystemChatInterface | null; messages: MessageInterface[] };
  getMessages(skip: number, limit?: number): Promise<MessageInterface[]>;
  createChat(metadata: TaskDto, messages?: MessageInterface[]): Promise<this>;
  findChatByParams(params: Partial<SystemChatInterface>): Promise<this>;
  addMessage(chatId: string, message: Partial<MessageInterface>): Promise<this>;
  closeChat(): Promise<this>;
}

@Injectable({ scope: Scope.REQUEST })
export class SystemChatEntity implements ISystemChatEntity {
  private _meta: SystemChatInterface | null;
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

  get meta(): SystemChatInterface | null {
    return this._meta;
  }

  get messages(): MessageInterface[] {
    return this._messages;
  }

  toObject(): {
    metadata: SystemChatInterface | null;
    messages: MessageInterface[];
  } {
    return {
      metadata: this._meta,
      messages: [], // Пока не знаю, массив с какими массивами должен быть
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
    const chat = (await this.chatsRepository.create(chatData)) as SystemChatInterface;
    if (!chat) {
      throw new InternalServerErrorException('Ошибка создания чата');
    }
    this._meta = chat;
    this._chatId = chat._id;
    return this;
  }

  async findChatByParams(params: Partial<SystemChatInterface>): Promise<this> {
    const chats = (await this.chatsRepository.find(params)) as SystemChatInterface[];
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
