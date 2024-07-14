import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatsRepository } from '../chats/chats.repository';
import { MessagesRepository } from '../messages/messages.repository';
import { ChatEntity } from '../../entities/chats/chat.entity';

@Module({
  providers: [ChatService, ChatsRepository, MessagesRepository, ChatEntity],
  exports: [ChatEntity],
})
export class ChatModule {}