import { Body, Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { AuthService } from './AuthService/auth.service';

@Controller()
export class AppController {
  constructor(private readonly authService: AuthService) {}

  @Post('signinadmin')
  async signInAdmin(@Body() credentials: { username: string, password: string }) {
    return this.authService.signInAdmin(credentials);
  }
}
