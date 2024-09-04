import { Injectable } from "@nestjs/common";
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import { ObjectId } from "mongoose";

import { ConflictChatsTupleMetaInterface,
  MessageInterface,
  SystemChatMetaInterface,
  TaskChatMetaInterface
} from "src/common/types/chats.types";
import { AdminInterface } from "src/common/types/user.types";
import { wsMessage } from "src/common/types/websockets.types";
import { ChatsRepository } from "src/datalake/chats/chats.repository";
import { MessagesRepository } from "src/datalake/messages/messages.repository";
import { ChatEntity } from "src/entities/chats/chat.entity";

@Injectable()
export class ChatService {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
    private readonly _chatRepository: ChatsRepository,
    private readonly _messageRepository: MessagesRepository
  ) {}

  async createTaskChat(metadata: TaskChatMetaInterface): Promise<wsMessage> {
    const chatEntity = new ChatEntity(
      this._chatRepository,
      this._messageRepository
    );

    const newChat = await chatEntity.createChat("TASK_CHAT", metadata);
    const chatMessages = await newChat.loadMessages([newChat.chatId], 0, 0);

    const response: wsMessage = {
      kind: "CHAT_PAGE_CONTENT",
      payload: {
        messages: chatMessages
      }
    }

    return response;
  }

  async createSystemChat(metadata: SystemChatMetaInterface): Promise<wsMessage> {
    const chatEntity = new ChatEntity(
      this._chatRepository,
      this._messageRepository
    );

    const newChat = await chatEntity.createChat("SYSTEM_CHAT", metadata);
    const chatMessages = await newChat.loadMessages([newChat.chatId], 0, 0);

    const response: wsMessage = {
      kind: "CHAT_PAGE_CONTENT",
      payload: {
        messages: chatMessages
      }
    }

    return response;
  }

  async createConflictChat(metadata: ConflictChatsTupleMetaInterface): Promise<wsMessage> {
    const chatEntity = new ChatEntity(
      this._chatRepository,
      this._messageRepository
    );

    const newChat = await chatEntity.createChat("CONFLICT_CHAT", metadata);
    const chatMessages = await newChat.loadMessages([newChat.chatId], 0, 0);

    const response: wsMessage = {
      kind: "CHAT_PAGE_CONTENT",
      payload: {
        messages: chatMessages
      }
    }

    return response;
  }

  async addMessage(chatId: ObjectId, message: MessageInterface): Promise<wsMessage> {
    const chatEntity = new ChatEntity(
      this._chatRepository,
      this._messageRepository
    );

    const chat = await chatEntity.findChatByParams({ chatId: chatId });
    chat.addMessage(message);

    const chatMessages = await chat.loadMessages([chat.chatId], 0, 0);

    const response: wsMessage = {
      kind: "CHAT_PAGE_CONTENT",
      payload: {
        messages: chatMessages
      }
    }

    return response;
  }

  async getConflictChatsByAdmin(admin: AdminInterface) {

  }

  async getConflictClosedChats() {

  }

  async getOpenSystemChats() {

  }

  async getClosedSystemChats() {

  }

  async getSystemChatsByUser() {

  }

  async getOpenSystemChatsByAdmin() {

  }

  async getClosedSystemChatsByAdmin() {

  }

  async closeChatByTask(taskId: ObjectId) {

  }

  async closeConflictChats(taskId: ObjectId) {

  }

  async closeSystemChat(chatId: ObjectId) {

  }
}
