import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { AuthModule } from './auth/auth.module';
import { CategoriesModule } from './categories/categories.module';
import configuration from './config/configuration';
import { TypeOrmConfigService } from './config/database-config.factory';
import { HashModule } from './common/hash/hash.module';
import { TasksWsModule } from './tasks-ws/tasks-ws.module';
import { TasksModule } from './tasks/tasks.module';
import { UserModule } from './users/user.module';
import { BlogArticlesModule } from './blog-articles/blog-articles.module';
import { ChatsModule } from './chats/chats.module';
import { ContactsModule } from './contacts/contacts.module';
import { PoliticsModule } from './politics/politics.module';
import { CategoryModule } from './datalake/category/category.module';
import { TaskModule } from './datalake/task/task.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [configuration] }),
    MongooseModule.forRoot('mongodb://localhost:27017/ya-pomogau-db'),
    HashModule,
    /*   TypeOrmModule.forRootAsync({
      imports: [],
      useClass: TypeOrmConfigService,
    }),
    ScheduleModule.forRoot(),
    AuthModule,

    TasksModule,
    CategoriesModule,
    UserModule,
    TasksWsModule,
    AuthModule,
    BlogArticlesModule,
    ChatsModule,
    ContactsModule,
    PoliticsModule,
    */
    TaskModule,
    // CategoryModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
