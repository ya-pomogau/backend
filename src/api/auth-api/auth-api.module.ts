import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { JwtModule } from '@nestjs/jwt';
import { AuthApiController } from './auth-api.controller';
import { AuthService } from '../../core/auth/auth.service';
import { UsersService } from '../../core/users/users.service';
import { AuthModule } from '../../core/auth/auth.module';
import { UsersModule } from '../../core/users/users.module';
import { UsersRepositoryModule } from '../../datalake/users/users-repository.module';

@Module({
  imports: [AuthModule, UsersModule, HttpModule, JwtModule, UsersRepositoryModule],
  controllers: [AuthApiController],
  providers: [AuthService, UsersService],
})
export class AuthApiModule {}
