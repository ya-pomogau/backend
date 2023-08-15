import { Module } from '@nestjs/common';
import { ChatGateway } from './chat.gateway';
import { ChatsService } from './chats.service';

@Module({
  providers: [ChatGateway, ChatsService],
})
export class ChatsModule {}
