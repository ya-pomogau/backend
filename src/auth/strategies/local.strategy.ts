import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { User } from '../../users/entities/user.entity';
import exceptions from '../../common/constants/exceptions';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      usernameField: 'login',
      passwordField: 'password',
    });
  }

  async validate(login: string, password: string): Promise<User> {
    const user = await this.authService.validatePassword(login, password);

    if (!user) {
      throw new UnauthorizedException(exceptions.auth.unauthorized);
    }

    if (user.isBlocked) {
      throw new UnauthorizedException(exceptions.auth.blocked);
    }

    return user;
  }
}
