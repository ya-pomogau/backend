import { Controller, Post, Request, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from '../AuthService/auth.service';

@Controller()
export class MainAdminController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(AuthGuard('local'))
  @Post('signinadmin')
  async signInAdmin(@Request() req) {
    const { user } = req;
    return this.authService.generateAdminToken(user);
  }
}
