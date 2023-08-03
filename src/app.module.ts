import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VolunteersModule } from './volunteers/volunteer.module';
import { Volunteer } from './volunteers/entities/volunteers.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mongodb',
      host: 'localhost',
      port: 27017,
      database: 'ihelp',
      entities: [Volunteer],
      synchronize: true,
    }),
    VolunteersModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
