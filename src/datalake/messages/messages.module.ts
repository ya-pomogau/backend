import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MessagesRepository } from './messages.repository';
import { Message, MessagesSchema } from './schemas/messages.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: Message.name, schema: MessagesSchema }])],
  providers: [MessagesRepository],
  exports: [MessagesRepository],
})
export class MessagesModule {}
