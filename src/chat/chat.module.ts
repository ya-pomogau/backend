import { Module } from '@nestjs/common';
import { ChatsService } from './chat.service';
import { ChatGateway } from './chat.gateway';

@Module({
  providers: [ChatGateway, ChatsService],
})
export class ChatModule {}
