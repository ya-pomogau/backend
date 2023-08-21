import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.vk';
import { AuthService } from './auth.service';
import { UserModule } from '../users/user.module';

@Module({
  imports: [ConfigModule, UserModule, HttpModule, JwtModule],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
