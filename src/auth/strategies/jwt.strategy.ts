import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UserService } from '../../users/user.service';
import exceptions from '../../common/constants/exceptions';
import type { IJwtUser } from '../types';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private configService: ConfigService, private usersService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get<string>('jwt.key'),
      ignoreExpiration: false,
    });
  }

  async validate(jwtPayload: IJwtUser) {
    const user = await this.usersService.findUserById(jwtPayload.sub);

    if (!user) {
      throw new UnauthorizedException(exceptions.auth.unauthorized);
    }

    if (user.isBlocked) {
      throw new UnauthorizedException(exceptions.auth.blocked);
    }

    return { ...user, ...jwtPayload };
  }
}
