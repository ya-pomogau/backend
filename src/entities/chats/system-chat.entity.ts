import { Injectable, Scope, InternalServerErrorException } from '@nestjs/common';
import { ChatsRepository } from '../../datalake/chats/chats.repository';
import { MessagesRepository } from '../../datalake/messages/messages.repository';
import { MessageInterface, SystemChatInterface } from '../../common/types/chats.types';
import { TaskDto } from '../../common/dtos/tasks.dto';

export interface ISystemChatEntity {
  getMessages(skip: number, limit?: number): Promise<MessageInterface[]>;
  createChat(metadata: TaskDto, messages: MessageInterface[]): Promise<this>;
  findChatByParams(params: Partial<SystemChatInterface>): Promise<this>;
  addMessage(chatId: string, message: Partial<MessageInterface>): Promise<this>;
  closeChat(): Promise<this>;
}

@Injectable({ scope: Scope.REQUEST })
export class SystemChatEntity implements ISystemChatEntity {
  private metadata: SystemChatInterface | null;
  private messages: MessageInterface[];
  private chatId: string;

  constructor(
    private readonly chatsRepository: ChatsRepository,
    private readonly messagesRepository: MessagesRepository
  ) {
    this.metadata = null;
    this.messages = [];
    this.chatId = ''; //наименование this._chatId не принимается типизацией
  }

  // добавил get к наименованию, чтобы линтер не ругался
  get getChatId() {
    return this.chatId;
  }

  get meta(): any {
    return this.metadata;
  }

  toObject(): any {
    return {
      metadata: this.metadata,
      messages: [this.messages], // Пока не знаю, массив с какими массивами должен быть
    };
  }

  async getMessages(skip: number, limit: number = 20): Promise<MessageInterface[]> {
    if (!this.chatId) {
      throw new InternalServerErrorException('Чат не найден');
    }
    const messages = (await this.messagesRepository.find(
      {
        chatId: this.chatId,
      },
      null,
      {
        skip,
        limit,
      }
    )) as MessageInterface[];
    this.messages = messages;
    return messages;
  }

  async createChat(metadata: TaskDto): Promise<this> {
    const chatData = { ...metadata, isActive: true };
    const chat = (await this.chatsRepository.create(chatData)) as SystemChatInterface;
    if (!chat) {
      throw new InternalServerErrorException('Ошибка создания чата');
    }
    this.metadata = chat;
    this.chatId = chat._id;
    return this;
  }

  async findChatByParams(params: Partial<SystemChatInterface>): Promise<this> {
    const chats = (await this.chatsRepository.find(params)) as SystemChatInterface[];
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
