import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { MainAdminService } from '../main-admin.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly mainAdminService: MainAdminService) {
    super();
  }

  async validate(username: string, password: string): Promise<any> {
    const mainAdmin = await this.mainAdminService.findByUsername(username);

    if (!mainAdmin) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isValidPassword = await this.mainAdminService.validatePassword(
      password,
      mainAdmin.password,
    );

    if (!isValidPassword) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return mainAdmin;
  }
}
