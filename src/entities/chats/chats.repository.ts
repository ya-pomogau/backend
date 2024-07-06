import { Injectable } from '@nestjs/common';
import { Chat, ConflictChat } from './schemas/chat.schema';
import { Message } from './schemas/message.schema';

@Injectable()
export class ChatRepository {
  private chats: Chat[] = [];
  private messages: Message[] = [];

  async create(chatData: Partial<Chat>): Promise<Chat> {
    const newChat: Chat = {
      id: Date.now().toString(),
      ...chatData,
      createdAt: new Date(),
      updatedAt: new Date(),
      active: true,
    } as Chat;
    this.chats.push(newChat);
    return newChat;
  }

  async find(params: Partial<Chat>, limit?: number): Promise<Chat[]> {
    const foundChats = this.chats.filter((chat) =>
      Object.entries(params).every(([key, value]) => chat[key] === value)
    );
    return limit ? foundChats.slice(0, limit) : foundChats;
  }

  async findConflictChats(params: Partial<ConflictChat>, limit?: number): Promise<ConflictChat[]> {
    const foundChats = this.chats.filter((chat) =>
      Object.entries(params).every(([key, value]) => chat[key] === value)
    ) as ConflictChat[];
    return limit ? foundChats.slice(0, limit) : foundChats;
  }

  async addMessage(chatId: string, messageData: Partial<Message>): Promise<Message> {
    const newMessage: Message = {
      id: Date.now().toString(),
      chatId,
      ...messageData,
      timestamp: new Date(),
    } as Message;
    this.messages.push(newMessage);
    return newMessage;
  }

  async closeChat(chatId: string): Promise<void> {
    const chat = this.chats.find((c) => c.id === chatId);
    if (chat) {
      chat.active = false;
    }
  }
}
