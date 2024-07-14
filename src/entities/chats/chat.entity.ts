import { Injectable, Scope } from '@nestjs/common';

@Injectable({ scope: Scope.TRANSIENT })
export class ChatEntity {
  private metadata: Record<string, any>[];
  private messages: Record<string, any>[][];

  constructor() {
    this.metadata = [];
    this.messages = [];
  }

  // Создание нового чата (кортежа конфликтных чатов)
  createChat(metadata: Record<string, any>, messages: Record<string, any>[]) {
    this.metadata.push(metadata);
    this.messages.push(messages);
    return this;
  }

  // Поиск чата (массива чатов) по параметрам
  findChatByParams(params: Record<string, any>) {
    // Логика поиска чатов по параметрам
    // Вернуть найденные чаты
    return this;
  }

  // Поиск кортежа (массива кортежей) конфликтных чатов по параметрам
  findConflictingChats(params: Record<string, any>) {
    // Логика поиска конфликтных чатов по параметрам
    // Вернуть найденные кортежи конфликтных чатов
    return this;
  }

  // Добавление сообщения в чат
  addMessage(chatId: number, message: Record<string, any>) {
    // Логика добавления сообщения в чат по chatId
    // Обновить массив сообщений
    return this;
  }

  // Закрытие (деактивация/архивация) чата
  closeChat(chatId: number) {
    // Логика деактивации/архивации чата по chatId
    return this;
  }
}
