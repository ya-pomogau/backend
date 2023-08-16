import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { HttpModule } from '@nestjs/axios';
import { AuthService } from './auth.service';
import { UserModule } from '../users/user.module';
import { AuthController } from './auth.controller';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';
import { HashModule } from '../hash/hash.module';
import { JwtConfigService } from '../config/jwt-config.factory';
import { UserRolesGuard } from './guards/user-roles.guard';
import { AdminPermissionsGuard } from './guards/admin-permissions.guard';

@Module({
  imports: [
    HttpModule,
    UserModule,
    PassportModule,
    HashModule,
    JwtModule.registerAsync({
      useClass: JwtConfigService,
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, JwtStrategy, UserRolesGuard, AdminPermissionsGuard],
  exports: [AuthService],
})
export class AuthModule {}
