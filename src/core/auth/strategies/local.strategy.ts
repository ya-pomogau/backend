import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../../users/users.service';
import { AdminInterface } from '../../../common/types/user.types';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly userService: UsersService) {
    super({ usernameField: 'login' });
  }

  async validate(
    username: string,
    password: string
  ): Promise<Record<string, unknown> | AdminInterface> {
    const user = await this.userService.checkAdminCredentials(username, password);
    if (!user) {
      throw new UnauthorizedException('Некорректная пара логин и пароль');
    }

    return user;
  }
}
