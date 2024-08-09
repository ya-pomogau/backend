import { Injectable, Scope } from '@nestjs/common';
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

type MetadataType<T extends ChatType> = T extends
  | typeof ChatTypes.CONFLICT_CHAT_WITH_VOLUNTEER
  | typeof ChatTypes.CONFLICT_CHAT_WITH_RECIPIENT
  ? ConflictChatsTupleMetaInterface
  : T extends typeof ChatTypes.SYSTEM_CHAT
  ? SystemChatMetaInterface
  : TaskChatMetaInterface;

type MessagesType<T extends ChatType> = T extends
  | typeof ChatTypes.CONFLICT_CHAT_WITH_VOLUNTEER
  | typeof ChatTypes.CONFLICT_CHAT_WITH_RECIPIENT
  ? ConflictChatContentTuple
  : MessageInterface[];

type UserType<T extends ChatType> = T extends typeof ChatTypes.SYSTEM_CHAT
  ? VolunteerInterface | RecipientInterface
  : null;

@Injectable({ scope: Scope.REQUEST })
export class ChatEntity<T extends ChatType> {
  private _metadata: MetadataType<T> | null = null;

  private _messages: MessagesType<T> | null = null;

  private _chatId: mongo.ObjectId | null = null;

  private _taskId: ObjectId | string | null = null;

  private _volunteer: VolunteerInterface | null = null;

  private _recipient: RecipientInterface | null = null;

  private _admin: AdminInterface | null = null;

  private _user: UserType<T> | null = null;

  constructor(
    private readonly chatsRepository: ChatsRepository,
    private readonly messagesRepository: MessagesRepository
  ) {}
}
