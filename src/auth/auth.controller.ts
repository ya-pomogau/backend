// auth/auth.controller.ts

import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signinadmin')
  async signInAdmin(@Body() credentials: { username: string; password: string }) {
    return this.authService.signInAdmin(credentials);
  }
}
