import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';

@Module({
  providers: [ChatService],
})
export class ChatModule {}
