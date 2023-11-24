import { Controller, Post } from '@nestjs/common';
import { VkLoginDto } from './dto/vk-login.dto';
import { AuthService } from '../../core/auth/auth.service';

@Controller('auth')
export class AuthApiController {
  constructor(private readonly authService: AuthService) {}

  @Post('vk')
  async vkLogin(dto: VkLoginDto) {
    return this.authService.loginUser(dto);
  }
}
