import { Injectable, Scope, InternalServerErrorException } from '@nestjs/common';
import { mongo, ObjectId } from 'mongoose';
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
export class ChatEntity<T extends ChatType> {
  private _kind: T;

  private _metadata: MetadataType = null;

  private _messages: MessagesType<T> | null = null;

  private _chatId: mongo.ObjectId | null = null;

  private _taskId: ObjectId | string | null = null;

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

  get chatId(): mongo.ObjectId | null {
    return this._chatId;
  }

  get messages(): MessagesType<T> | null {
    return this._messages;
  }

  public get metadata(): MetadataType | null {
    return this._metadata;
  }

  public async createChat(kind: T, metadata: MetadataType | null): Promise<this> {
    if (!metadata) {
      throw new InternalServerErrorException('Ошибка на сервере при создании чата!', {
        cause: `Некорректно переданы метаданные! metadata: ${kind}`,
      });
    }
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
        switch (systemMetadata?.user?.role) {
          case UserRole.VOLUNTEER:
            this._volunteer = systemMetadata?.user as VolunteerInterface;
            break;
          case UserRole.RECIPIENT:
            this._recipient = systemMetadata?.user as RecipientInterface;
            break;
          default:
            throw new InternalServerErrorException('Ошибка на сервере при создании чата!', {
              cause: `Невозможно определить роль пользователя! systemMetadata.user.role: ${systemMetadata.user.role}`,
            });
        }
        this._admin = systemMetadata.admin;
        break;
      }
      case (ChatTypes.CONFLICT_CHAT_WITH_VOLUNTEER ||
        ChatTypes.CONFLICT_CHAT_WITH_RECIPIENT) as T: {
        const conflictMetadata = metadata as ConflictChatsTupleMetaInterface;
        this._taskId = conflictMetadata.taskId;
        this._admin = conflictMetadata.moderator;
        this._volunteer = conflictMetadata.meta[0]?.volunteer;
        this._recipient = conflictMetadata.meta[1]?.recipient;
        break;
      }
      default:
        throw new InternalServerErrorException('Ошибка на сервере при создании чата!', {
          cause: `Передан неизвестный тип чата! kind: ${kind}`,
        });
    }
    const dto = { ...metadata, isActive: true };
    const chatEntity = (await this.chatsRepository.create(dto)) as {
      _id: mongo.ObjectId;
    } & MetadataType;
    if (!chatEntity) {
      throw new InternalServerErrorException('Ошибка на сервере при создании чата!', {
        cause: `Данные, вернувшиеся из базы данных: ${chatEntity}`,
      });
    }
    this._chatId = chatEntity._id;
    return this;
  }

  public async loadMessages(skip: number, limit: number = 20): Promise<MessagesType<T>> {
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
    switch (this._kind) {
      case (ChatTypes.CONFLICT_CHAT_WITH_RECIPIENT ||
        ChatTypes.CONFLICT_CHAT_WITH_VOLUNTEER) as T: {
        const volunteerMessages = messages.filter((message) => {
          return message?.author?.role === UserRole.VOLUNTEER;
        });
        const recipientMessages = messages.filter((message) => {
          return message?.author?.role === UserRole.RECIPIENT;
        });
        this._messages = [volunteerMessages, recipientMessages] as MessagesType<T>;
        break;
      }
      case (ChatTypes.SYSTEM_CHAT || ChatTypes.TASK_CHAT) as T: {
        this._messages = messages as MessagesType<T>;
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
    return this._messages;
  }

  public async findChatByParams(params: Record<string, unknown>): Promise<MetadataType | null> {
    const chat = await this.chatsRepository.findOne(params);
    if (!chat) {
      throw new InternalServerErrorException('Чат по указанным параметрам не найден.', {
        cause: `Данные, вернувшиеся из базы данных: ${chat}`,
      });
    }
    switch (this._kind) {
      case ChatTypes.TASK_CHAT as T:
        return chat as TaskChatMetaInterface;
      case ChatTypes.SYSTEM_CHAT as T:
        return chat as SystemChatMetaInterface;
      case (ChatTypes.CONFLICT_CHAT_WITH_RECIPIENT || ChatTypes.CONFLICT_CHAT_WITH_VOLUNTEER) as T:
        return chat as ConflictChatsTupleMetaInterface;
      default:
        throw new InternalServerErrorException(
          'Ошибка на сервере при запросе сообщений чата из базы данных!',
          {
            cause: `Передан неизвестный тип чата! kind: ${this._kind}`,
          }
        );
    }
  }
}
