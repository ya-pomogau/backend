import { Injectable } from '@nestjs/common';
import { ChatEntity } from './chat.entity';

@Injectable()
export class ChatService {
  private chats: ChatEntity[] = [];

  createChat(metadata: Record<string, any>, messages: Record<string, any>[]) {
    const chat = new ChatEntity().createChat(metadata, messages);
    this.chats.push(chat);
    return chat;
  }

  findChatByParams(params: Record<string, any>) {
    return this.chats.find((chat) => chat.findChatByParams(params));
  }

  findConflictingChats(params: Record<string, any>) {
    return this.chats.filter((chat) => chat.findConflictingChats(params));
  }

  addMessage(chatId: number, message: Record<string, any>) {
    const chat = this.chats[chatId];
    if (chat) {
      chat.addMessage(chatId, message);
    }
    return chat;
  }

  closeChat(chatId: number) {
    const chat = this.chats[chatId];
    if (chat) {
      chat.closeChat(chatId);
    }
    return chat;
  }
}
