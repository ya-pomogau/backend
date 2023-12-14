import { Body, Controller, InternalServerErrorException, Post } from '@nestjs/common';
import { VkLoginDto } from './dto/vk-login.dto';
import { AuthService } from '../../core/auth/auth.service';
import { VKNewUserDto } from './dto/vk-new.dto';
import { UsersService } from '../../core/users/users.service';

@Controller('auth')
export class AuthApiController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService
  ) {}

  @Post('vk')
  async vkLogin(@Body() dto: VkLoginDto) {
    return this.authService.loginVK(dto);
  }

  @Post('new')
  async register(@Body() dto: VKNewUserDto) {
    const user = await this.usersService.createUser(dto);
    if (user) {
      const token = await this.authService.authenticate(user);
      return { token, user };
    }
    throw new InternalServerErrorException('Ошибка создания пользователя');
  }
}
