import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MainAdminController } from './main-admin.controller';
import { MainAdminService } from './main-admin.service';
import { MainAdmin } from './main-admin.entity';
import { JwtStrategy } from './strategy/jwt.strategy';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [
    TypeOrmModule.forFeature([MainAdmin]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
  ],
  controllers: [MainAdminController],
  providers: [MainAdminService, JwtStrategy],
})
export class MainAdminModule {}
