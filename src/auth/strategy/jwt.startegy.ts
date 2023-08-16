import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private configService: ConfigService, private usersService: any) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get<string>('JWT_SECRET') || 'SECRET_KEY',
      ignoreExpiration: false,
    });
  }

  async validate(jwtPayload: { sub: number }) {
    const user = await this.usersService.validateJwt(jwtPayload.sub);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
