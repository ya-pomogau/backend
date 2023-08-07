import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { MainAdminService } from '../main-admin/main-admin.service';
import { SignInAdminDto } from '../main-admin/dto/sign-in-admin.dto';
import { MainAdmin } from 'src/main-admin/main-admin.entity';

@Injectable()
export class AuthService {
  constructor(
    private mainAdminService: MainAdminService,
    private jwtService: JwtService,
  ) {}
  async generateAdminToken(mainAdmin: MainAdmin) {
    const payload = { sub: mainAdmin.id, username: mainAdmin.username };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async signInAdmin(credentials: { username: string; password: string }): Promise<any> {
    const { username, password } = credentials;
    const mainAdmin = await this.mainAdminService.findByUsername(username);

    if (mainAdmin && mainAdmin.password === password) {
      // Generate JWT token
      const payload = { sub: mainAdmin.id };
      const token = this.jwtService.sign(payload);

      return { access_token: token };
    }

    throw new UnauthorizedException('Invalid credentials');
  }
}
