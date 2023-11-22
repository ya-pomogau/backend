import { Module } from '@nestjs/common';
import { AuthApiService } from './auth-api.service';
import { AuthApiController } from './auth-api.controller';

@Module({
  controllers: [AuthApiController],
  providers: [AuthApiService],
})
export class AuthApiModule {}
