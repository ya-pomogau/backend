import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatGateway } from './chat.gateway';
import { ChatsService } from './chats.service';
import { Chat } from './entities/chat.entity';
import { ChatsController } from './chats.controller';
import { CronService } from './cronService';

@Module({
  imports: [TypeOrmModule.forFeature([Chat])],
  controllers: [ChatsController],
  providers: [ChatGateway, ChatsService, CronService],
})
export class ChatsModule {}
