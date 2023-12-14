import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
// import { ScheduleModule } from '@nestjs/schedule';
import { MongooseModule } from '@nestjs/mongoose';
import { AppService } from './app.service';

import configuration from './config/configuration';
import { HashModule } from './common/hash/hash.module';
import { UsersRepositoryModule } from './datalake/users/users-repository.module';
import { CategoryModule } from './datalake/category/category.module';
import { TaskModule } from './datalake/task/task.module';
import { ConfidentialityPolicyModule } from './datalake/confidentiality-policy/confidentiality-policy.module';
import { AuthApiModule } from './api/auth-api/auth-api.module';
import { AuthModule } from './core/auth/auth.module';
import { UsersModule } from './core/users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [configuration] }),
    MongooseModule.forRoot('mongodb://localhost:27017/ya-pomogau-db'),
    HashModule,
    // ScheduleModule.forRoot(),
    TaskModule,
    UsersRepositoryModule,
    CategoryModule,
    ConfidentialityPolicyModule,
    AuthApiModule,
    AuthModule,
    UsersModule,
  ],
  providers: [AppService],
})
export class AppModule {}
