import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInAdminDto } from '../main-admin/dto/sign-in-admin.dto';

@Controller()
export class AppController {
  constructor(private readonly authService: AuthService) {}

  @Post('signinadmin')
  async signInAdmin(@Body() credentials: { username: string; password: string }) {
    return this.authService.signInAdmin(credentials);
  }
}
