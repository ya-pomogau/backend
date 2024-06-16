import { Module } from '@nestjs/common';
import { ModelDefinition, MongooseModule } from '@nestjs/mongoose';
import { Chat, ChatSchema } from './schemas/chat.schema';
import { ChatsRepository } from './chats.repository';
import { TaskChat, TaskChatSchema } from './schemas/task-chat.schema';
import { SystemChat, SystemChatSchema } from './schemas/system-chat.schema';
import {
  ConflictWithVolunteerChat,
  ConflictWithVolunteerChatSchema,
} from './schemas/conflict-volunteer-chat.schema';
import {
  ConflictWithRecipientChat,
  ConflictWithRecipientChatSchema,
} from './schemas/conflict-recipient-chat.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Chat.name,
        schema: ChatSchema,
        discriminators: [
          { name: TaskChat.name, schema: TaskChatSchema },
          { name: SystemChat.name, schema: SystemChatSchema },
          { name: ConflictWithVolunteerChat.name, schema: ConflictWithVolunteerChatSchema },
          { name: ConflictWithRecipientChat.name, schema: ConflictWithRecipientChatSchema },
        ],
      } as ModelDefinition,
    ]),
  ],
  providers: [ChatsRepository],
  exports: [ChatsRepository],
})
export class ChatsRepositoryModule {}
