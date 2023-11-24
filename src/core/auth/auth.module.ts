import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { UsersRepository } from '../../datalake/users/users.repository';
import { UsersService } from '../users/users.service';

@Module({
  imports: [
    UsersRepository,
    UsersService,
    AuthService,
    JwtModule.register({
      secretOrPrivateKey: '98sdfijef3fd4',
      signOptions: { expiresIn: '3d' },
    }),
  ],
  providers: [AuthService],
})
export class AuthModule {}
