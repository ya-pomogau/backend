import { Strategy, ExtractJwt } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../../AuthService/auth.service';
import { MainAdminService } from '../main-admin.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly authService: AuthService,
    private readonly mainAdminService: MainAdminService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: 'your_secret_key', // Replace with your JWT secret key
    });
  }

  async validate(payload: any) {
    const mainAdmin = await this.mainAdminService.findOneById(payload.sub);
  
    if (!mainAdmin) {
      throw new UnauthorizedException('Invalid token');
    }
  
    return mainAdmin;
  }  
}
