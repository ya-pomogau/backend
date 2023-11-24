import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
// import { ScheduleModule } from '@nestjs/schedule';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import configuration from './config/configuration';
import { HashModule } from './common/hash/hash.module';
import { UsersModule } from './datalake/users/users.module';
import { CategoryModule } from './datalake/category/category.module';
import { TaskModule } from './datalake/task/task.module';
import { ConfidentialityPolicyModule } from './datalake/confidentiality-policy/confidentiality-policy.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [configuration] }),
    MongooseModule.forRoot('mongodb://localhost:27017/ya-pomogau-db'),
    HashModule,
    // ScheduleModule.forRoot(),
    TaskModule,
    UsersModule,
    CategoryModule,
    ConfidentialityPolicyModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
