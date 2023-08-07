import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import {AuthController } from './auth.controller';
import { MainAdminModule } from '../main-admin/main-admin.module';
import { JwtStrategy } from '../main-admin/strategy/jwt.strategy';

@Module({
  imports: [
    JwtModule.register({
      secret: 'your-secret-key', // Replace with your actual secret key
      signOptions: { expiresIn: '60s' },
    }),
    PassportModule,
    MainAdminModule,
  ],
  providers: [AuthService, JwtStrategy],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}