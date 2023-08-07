import { Controller, Post, Request, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { LocalAuthGuard } from 'src/auth/local-auth.guard';
import { AuthService } from '../auth/auth.service';

@Controller()
export class MainAdminController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard) // Use the LocalAuthGuard to authenticate
  @Post('signinadmin')
  async signInAdmin(@Request() req) {
    const { user } = req;
    return this.authService.generateAdminToken(user);
  }
}
