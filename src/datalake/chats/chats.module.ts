import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ChatsRepository } from './chats.repository';
import { Chats, ChatsSchema } from './schemas/chats.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: Chats.name, schema: ChatsSchema }])],
  providers: [ChatsRepository],
  exports: [ChatsRepository],
})
export class ChatsModule {}
