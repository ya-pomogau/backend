import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import configuration from './config/configuration';
import { TypeOrmConfigService } from './config/database-config.factory';
import { TasksModule } from './tasks/tasks.module';
import { UserModule } from './users/user.module';
import { ChatsService } from './chats/chats.service';
import { ChatsController } from './chats/chats.controller';
import { ChatsModule } from './chats/chats.module';
import { MessagesService } from './messages/messages.service';
import { MessagesController } from './messages/messages.controller';
import { MessagesModule } from './messages/messages.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [configuration] }),
    TypeOrmModule.forRootAsync({
      imports: [],
      useClass: TypeOrmConfigService,
    }),
    TasksModule,
    UserModule,
    ChatsModule,
    MessagesModule,
  ],
  controllers: [AppController, ChatsController, MessagesController],
  providers: [AppService, ChatsService, MessagesService],
})
export class AppModule {}
