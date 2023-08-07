import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MainAdminModule } from './main-admin/main-admin.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './AuthService/auth.service';
import { JwtStrategy } from './main-admin/strategy/jwt.strategy';
import { LocalStrategy } from './main-admin/strategy/local.strategy';

@Module({
  imports: [
    TypeOrmModule.forRoot(/* your config */),
    MainAdminModule,
    PassportModule,
    JwtModule.register({
      secret: 'your_secret_key',
      signOptions: { expiresIn: '1h' }, // Set the token expiration time
    }),
  ],
  providers: [AuthService, JwtStrategy, LocalStrategy],
})
export class AppModule {}
