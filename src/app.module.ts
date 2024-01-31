import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
// import { ScheduleModule } from '@nestjs/schedule';
import { MongooseModule } from '@nestjs/mongoose';
import { APP_GUARD } from '@nestjs/core';

import configuration from './config/configuration';
import { HashModule } from './common/hash/hash.module';
import { UsersRepositoryModule } from './datalake/users/users-repository.module';
import { CategoryModule } from './datalake/category/category.module';
import { TaskModule } from './datalake/task/task.module';
import { ConfidentialityPolicyModule } from './datalake/confidentiality-policy/confidentiality-policy.module';
import { AuthApiModule } from './api/auth-api/auth-api.module';
import { AuthModule } from './core/auth/auth.module';
import { UsersModule } from './core/users/users.module';
import { MongooseConfigService } from './config/database-config.service';
import { JwtAuthGuard } from './common/guards/jwt-auth.guard';
import { AdminApiModule } from './api/admin-api/admin-api.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [configuration] }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useClass: MongooseConfigService,
    }),
    HashModule,
    // ScheduleModule.forRoot(),
    TaskModule,
    UsersRepositoryModule,
    CategoryModule,
    ConfidentialityPolicyModule,
    AuthApiModule,
    AuthModule,
    UsersModule,
    AdminApiModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
