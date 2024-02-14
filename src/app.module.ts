import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
// import { ScheduleModule } from '@nestjs/schedule';
import { MongooseModule } from '@nestjs/mongoose';
import { APP_GUARD } from '@nestjs/core';

import configuration from './config/configuration';
import { HashModule } from './common/hash/hash.module';
import { UsersRepositoryModule } from './datalake/users/users-repository.module';
import { CategoryRepositoryModule } from './datalake/category/category-repository.module';
import { TaskModule } from './datalake/task/task.module';
import { PolicyRepositoryModule } from './datalake/confidentiality-policy/policy-repository.module';
import { AuthApiModule } from './api/auth-api/auth-api.module';
import { AuthModule } from './core/auth/auth.module';
import { UsersModule } from './core/users/users.module';
import { MongooseConfigService } from './config/database-config.service';
import { JwtAuthGuard } from './common/guards/jwt-auth.guard';
import { CategoriesModule } from './core/categories/categories.module';
import { AdminApiModule } from './api/admin-api/admin-api.module';
import { BlogModule } from './core/blog/blog.module';
import { PolicyModule } from './core/policy/policy.module';

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
    PolicyRepositoryModule,
    AuthApiModule,
    AuthModule,
    UsersModule,
    CategoryRepositoryModule,
    CategoriesModule,
    AdminApiModule,
    BlogModule,
    PolicyModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
