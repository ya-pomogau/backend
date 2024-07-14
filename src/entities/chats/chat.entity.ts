import { Injectable, Scope } from '@nestjs/common';
import { ChatsRepository } from '../../datalake/chats/chats.repository';
import { MessagesRepository } from '../../datalake/messages/messages.repository';

@Injectable({ scope: Scope.TRANSIENT })
export class ChatEntity {
  private metadata: any[];
  private messages: any[][];

  constructor(
    private readonly chatsRepository: ChatsRepository,
    private readonly messagesRepository: MessagesRepository
  ) {
    this.metadata = [];
    this.messages = [];
  }
}
