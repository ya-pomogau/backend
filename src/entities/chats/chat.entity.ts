import { Injectable, Scope, InternalServerErrorException } from '@nestjs/common';
import { type ObjectId } from 'mongoose';
import {
  ChatType,
  ChatTypes,
  ConflictChatContentTuple,
  ConflictChatsTupleMetaInterface,
  MessageInterface,
  SystemChatMetaInterface,
  TaskChatMetaInterface,
} from '../../common/types/chats.types';
import { ChatsRepository } from '../../datalake/chats/chats.repository';
import { MessagesRepository } from '../../datalake/messages/messages.repository';
import {
  AdminInterface,
  RecipientInterface,
  VolunteerInterface,
} from '../../common/types/user.types';
import { UserRole } from '../../common/types/user.types';

export interface ChatEntityInterface<T extends ChatType> {
  chatId: string | ObjectId | null;
  metadata: MetadataType | null;
  messages: MessagesType<T> | null;

  toObject(): { metadata: MetadataType; messages: MessagesType<T> | null };

  loadMessages(skip: number, limit?: number): Promise<MessagesType<T>>;

  createChat(kind: T, metadata: MetadataType | null): Promise<ChatEntityInterface<T>>;

  findChatByParams(params: Record<string, unknown>): Promise<ChatEntityInterface<T> | null>;

  addMessage(newMessage: Partial<MessageInterface>): Promise<this>;

  closeChat(): Promise<this>;
}

type MetadataType =
  | ConflictChatsTupleMetaInterface
  | SystemChatMetaInterface
  | TaskChatMetaInterface;

type MessagesType<T extends ChatType> = T extends
  | typeof ChatTypes.CONFLICT_CHAT_WITH_VOLUNTEER
  | typeof ChatTypes.CONFLICT_CHAT_WITH_RECIPIENT
  ? ConflictChatContentTuple
  : MessageInterface[];

@Injectable({ scope: Scope.REQUEST })
export class ChatEntity<T extends ChatType> implements ChatEntityInterface<T> {
  private _kind: T;

  private _metadata: MetadataType = null;

  private _messages: MessagesType<T> | null = null;

  private _chatId: string | ObjectId | null = null;

  private _taskId: string | ObjectId | null = null;

  private _volunteer: VolunteerInterface | null = null;

  private _recipient: RecipientInterface | null = null;

  private _admin: AdminInterface | null = null;

  constructor(
    private readonly chatsRepository: ChatsRepository,
    private readonly messagesRepository: MessagesRepository
  ) {}

  public toObject(): { metadata: MetadataType; messages: MessagesType<T> | null } {
    return {
      metadata: this._metadata,
      messages: this._messages,
    };
  }

  public get chatId(): string | ObjectId | null {
    return this._chatId;
  }

  public get metadata(): MetadataType | null {
    return this._metadata;
  }

  public get messages(): MessagesType<T> | null {
    return this._messages;
  }

  public async createChat(kind: T, metadata: MetadataType | null): Promise<ChatEntityInterface<T>> {
    if (!metadata) {
      throw new InternalServerErrorException('Ошибка сервера!', {
        cause: `Некорректно переданы метаданные! metadata: ${kind}`,
      });
    }
    this._kind = kind;
    this._metadata = metadata;
    switch (kind) {
      case ChatTypes.TASK_CHAT as T: {
        const taskMetadata = metadata as TaskChatMetaInterface;
        this._taskId = taskMetadata.taskId;
        this._volunteer = taskMetadata.volunteer;
        this._recipient = taskMetadata.recipient;
        break;
      }
      case ChatTypes.SYSTEM_CHAT as T: {
        const systemMetadata = metadata as SystemChatMetaInterface;
        switch (systemMetadata.user.role) {
          case UserRole.VOLUNTEER:
            this._volunteer = systemMetadata.user as VolunteerInterface;
            break;
          case UserRole.RECIPIENT:
            this._recipient = systemMetadata.user as RecipientInterface;
            break;
          default:
            throw new InternalServerErrorException('Ошибка сервера!', {
              cause: `Невозможно определить роль пользователя! systemMetadata.user.role: ${systemMetadata.user.role}`,
            });
        }
        this._admin = systemMetadata.admin;
        break;
      }
      case ChatTypes.CONFLICT_CHAT_WITH_RECIPIENT as T:
      case ChatTypes.CONFLICT_CHAT_WITH_VOLUNTEER as T: {
        const conflictMetadata = metadata as ConflictChatsTupleMetaInterface;
        this._taskId = conflictMetadata.taskId;
        this._admin = conflictMetadata.moderator;
        this._volunteer = conflictMetadata.meta[0]?.volunteer;
        this._recipient = conflictMetadata.meta[1]?.recipient;
        break;
      }
      default:
        throw new InternalServerErrorException('Ошибка сервера!', {
          cause: `Передан неизвестный тип чата! kind: ${kind}`,
        });
    }
    const dto = { ...metadata, isActive: true };
    const chatEntity = (await this.chatsRepository.create(dto)) as {
      _id: ObjectId;
    } & MetadataType;
    if (!chatEntity) {
      throw new InternalServerErrorException('Ошибка сервера!', {
        cause: `Данные, вернувшиеся из базы данных: ${chatEntity}`,
      });
    }
    this._chatId = chatEntity._id;
    this._metadata = { ...this._metadata, isActive: true };
    return this;
  }

  public async loadMessages(skip: number, limit: number = 20): Promise<MessagesType<T>> {
    if (!this._chatId) {
      throw new InternalServerErrorException('Ошибка сервера!', {
        cause: `Не определён id чата! chatId: ${this._chatId}`,
      });
    }
    if (skip < 0 || limit < 0) {
      throw new InternalServerErrorException('Ошибка сервера!', {
        cause: `Параметры skip и limit не могут быть отрицательными! skip: ${skip}, limit: ${limit}.`,
      });
    }
    // Если limit равен 0, не ограничиваем количество загружаемых сообщений
    const queryOptions = limit === 0 ? { skip } : { skip, limit };
    const messages = (await this.messagesRepository.find(
      {
        chatId: this._chatId,
      },
      null,
      queryOptions
    )) as MessageInterface[];
    switch (this._kind) {
      case ChatTypes.CONFLICT_CHAT_WITH_RECIPIENT as T:
      case ChatTypes.CONFLICT_CHAT_WITH_VOLUNTEER as T: {
        const volunteerMessages = messages.filter(
          (msg) => msg.author && msg.author.role === UserRole.VOLUNTEER
        );
        const recipientMessages = messages.filter(
          (msg) => msg.author && msg.author.role === UserRole.RECIPIENT
        );
        this._messages = [volunteerMessages, recipientMessages] as MessagesType<T>;
        break;
      }
      case ChatTypes.SYSTEM_CHAT as T:
      case ChatTypes.TASK_CHAT as T: {
        this._messages = messages as MessagesType<T>;
        break;
      }
      default:
        throw new InternalServerErrorException('Ошибка сервера!', {
          cause: `Передан неизвестный тип чата! kind: ${this._kind}`,
        });
    }
    return this._messages;
  }

  public async findChatByParams(params: Record<string, unknown>): Promise<ChatEntityInterface<T> | null> {
    const data = await this.chatsRepository.findOne(params);
    if (!data) {
      throw new InternalServerErrorException('Ошибка сервера!', {
        cause: `Данные, вернувшиеся из базы данных: ${data}`,
      });
    }
    this._metadata = data as MetadataType;
    this._chatId = (data as any)._id;
    switch (this._kind) {
      case ChatTypes.TASK_CHAT as T: {
        const taskMetadata = data as TaskChatMetaInterface;
        this._taskId = taskMetadata.taskId;
        this._volunteer = taskMetadata.volunteer;
        this._recipient = taskMetadata.recipient;
        break;
      }
      case ChatTypes.SYSTEM_CHAT as T: {
        const systemMetadata = data as SystemChatMetaInterface;
        switch (systemMetadata.user.role) {
          case UserRole.VOLUNTEER:
            this._volunteer = systemMetadata.user as VolunteerInterface;
            break;
          case UserRole.RECIPIENT:
            this._recipient = systemMetadata.user as RecipientInterface;
            break;
          default:
            throw new InternalServerErrorException('Ошибка сервера!', {
              cause: `Невозможно определить роль пользователя! systemMetadata.user.role: ${systemMetadata.user.role}`,
            });
        }
        this._admin = systemMetadata.admin;
        break;
      }
      case ChatTypes.CONFLICT_CHAT_WITH_RECIPIENT as T:
      case ChatTypes.CONFLICT_CHAT_WITH_VOLUNTEER as T: {
        const conflictMetadata = data as ConflictChatsTupleMetaInterface;
        this._taskId = conflictMetadata.taskId;
        this._admin = conflictMetadata.moderator;
        this._volunteer = conflictMetadata.meta[0]?.volunteer;
        this._recipient = conflictMetadata.meta[1]?.recipient;
        break;
      }
      default:
        throw new InternalServerErrorException('Ошибка сервера!', {
          cause: `Передан неизвестный тип чата! kind: ${this._kind}`,
        });
    }
    return this;
  }

  public async addMessage(newMessage: Partial<MessageInterface>): Promise<this> {
    if (!this._chatId) {
      throw new InternalServerErrorException('Ошибка сервера!', {
        cause: `Не определён id чата! chatId: ${this._chatId}`,
      });
    }
    if (!newMessage.author || !newMessage.body) {
      throw new InternalServerErrorException('Ошибка сервера!', {
        cause: `Некорректное сообщение!`,
      });
    }
    const savedMessage = (await this.messagesRepository.create({
      ...newMessage,
      chatId: this._chatId,
    })) as MessageInterface;
    if (this._messages === null) {
      switch (this._kind) {
        case ChatTypes.CONFLICT_CHAT_WITH_RECIPIENT as T:
        case ChatTypes.CONFLICT_CHAT_WITH_VOLUNTEER as T: {
          this._messages = [[], []] as unknown as MessagesType<T>;
          break;
        }
        case ChatTypes.SYSTEM_CHAT as T:
        case ChatTypes.TASK_CHAT as T: {
          this._messages = [] as unknown as MessagesType<T>;
          break;
        }
        default:
          throw new InternalServerErrorException(
            'Ошибка на сервере при запросе сообщений чата из базы данных!',
            {
              cause: `Передан неизвестный тип чата! kind: ${this._kind}`,
            }
          );
      }
    }

    switch (this._kind) {
      case ChatTypes.CONFLICT_CHAT_WITH_RECIPIENT as T:
      case ChatTypes.CONFLICT_CHAT_WITH_VOLUNTEER as T: {
        if (savedMessage.author.role === UserRole.VOLUNTEER) {
          (this._messages[0] as unknown as MessageInterface[]).push(savedMessage);
        } else if (savedMessage.author.role === UserRole.RECIPIENT) {
          (this._messages[1] as unknown as MessageInterface[]).push(savedMessage);
        }
        break;
      }
      case ChatTypes.SYSTEM_CHAT as T:
      case ChatTypes.TASK_CHAT as T: {
        (this._messages as MessageInterface[]).push(savedMessage);
        break;
      }
      default:
        throw new InternalServerErrorException(
          'Ошибка на сервере при запросе сообщений чата из базы данных!',
          {
            cause: `Передан неизвестный тип чата! kind: ${this._kind}`,
          }
        );
    }
    return this;
  }

  public async closeChat(): Promise<this> {
    if (!this._chatId) {
      throw new InternalServerErrorException('Ошибка сервера!', {
        cause: `Не определён id чата! chatId: ${this._chatId}`,
      });
    }

    const updatedChat = await this.chatsRepository.findByIdAndUpdate(
      this._chatId,
      { isActive: false },
      { new: true }
    );
    if (!updatedChat) {
      throw new InternalServerErrorException('Чат не найден');
    }
    if (this._metadata) {
      this._metadata = { ...this._metadata, isActive: false };
    }
    return this;
  }
}
