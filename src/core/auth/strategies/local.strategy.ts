import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../../users/users.service';
import { Admin } from '../../../datalake/users/schemas/admin.schema';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly userService: UsersService) {
    super({ usernameField: 'login' });
  }

  async validate(username: string, password: string): Promise<Record<string, unknown> | Admin> {
    const user = await this.userService.checkAdminCredentials(username, password);
    if (!user) {
      throw new UnauthorizedException('Некорректная пара логин и пароль');
    }

    return user;
  }
}
