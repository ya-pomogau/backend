import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import configuration from './config/configuration';
import { TypeOrmConfigService } from './config/database-config.factory';
import { TasksModule } from './tasks/tasks.module';
import { CategoriesModule } from './categories/categories.module';
import { UserModule } from './users/user.module';
import { TasksWsModule } from './tasks-ws/tasks-ws.module';
import { HashModule } from './hash/hash.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [configuration] }),
    TypeOrmModule.forRootAsync({
      imports: [],
      useClass: TypeOrmConfigService,
    }),
    TasksModule,
    CategoriesModule,
    UserModule,
    TasksWsModule,
    HashModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
