// app.module.ts

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AuthModule } from './auth/auth.module';
import { MainAdminModule } from './main-admin/main-admin.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mongodb',
      host: 'localhost',
      port: 27017,
      database: 'ihelp',
      entities: [],
      synchronize: true,
    }), // Add your TypeORM configuration here
    AuthModule,
    MainAdminModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
