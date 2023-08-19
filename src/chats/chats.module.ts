import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Chat } from './entities/chat.entity';
import { ChatGateway } from './chat.gateway';
import { ChatService } from './chats.service';

@Module({
  imports: [TypeOrmModule.forFeature([Chat])],
  providers: [ChatGateway, ChatService],
})
export class ChatModule {}
