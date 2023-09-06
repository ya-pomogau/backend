import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { AuthModule } from './auth/auth.module';
import { CategoriesModule } from './categories/categories.module';
import configuration from './config/configuration';
import { TypeOrmConfigService } from './config/database-config.factory';
import { HashModule } from './hash/hash.module';
import { TasksWsModule } from './tasks-ws/tasks-ws.module';
import { TasksModule } from './tasks/tasks.module';
import { UserModule } from './users/user.module';
import { BlogArticlesModule } from './blog-articles/blog-articles.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [configuration] }),
    TypeOrmModule.forRootAsync({
      imports: [],
      useClass: TypeOrmConfigService,
    }),

    AuthModule,

    TasksModule,
    CategoriesModule,
    UserModule,
    TasksWsModule,
    HashModule,
    AuthModule,
    BlogArticlesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
