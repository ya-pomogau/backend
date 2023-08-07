import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { MainAdminService } from '../main-admin/main-admin.service';

@Injectable()
export class AuthService {
  constructor(private readonly mainAdminService: MainAdminService, private readonly jwtService: JwtService) {}

  async validate(payload: any) {
    const mainAdmin = await this.mainAdminService.findByUsername(payload.username);
    if (!mainAdmin) {
      throw new UnauthorizedException();
    }
    return mainAdmin;
  }

  async signInAdmin(credentials: { username: string; password: string }) {
    // Validate credentials and return JWT token
    // Implement this logic based on your requirements
    const mainAdmin = await this.mainAdminService.findByUsername(credentials.username);
    if (mainAdmin && mainAdmin.password === credentials.password) {
      const payload = { username: mainAdmin.username, sub: mainAdmin.id };
      return {
        access_token: this.jwtService.sign(payload),
      };
    }
    throw new UnauthorizedException();
  }
  async generateAdminToken(user: any) {
    const payload = { username: user.username, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload)
    };
  }
  async findAdminById(id: number) {
    return this.mainAdminService.findById(id);
  }
}
