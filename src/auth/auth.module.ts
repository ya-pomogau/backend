import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserModule } from '../users/user.module';
import { Token } from './entities/token.entity';

@Module({
  imports: [ConfigModule, UserModule, HttpModule, JwtModule, TypeOrmModule.forFeature([Token])],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
