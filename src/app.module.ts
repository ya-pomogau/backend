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
  ],
  controllers: [AppController, ChatsController],
  providers: [AppService, ChatsService],
})
export class AppModule {}
