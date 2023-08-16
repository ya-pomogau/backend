import { Controller, Post, UseGuards } from '@nestjs/common';
import { UserService } from '../users/user.service';
import { AuthService } from './auth.service';
import { LocalGuard } from './guards/local.guard';
import { User } from '../users/entities/user.entity';
import { SigninResponseDto } from './dto/signin-response.dto';
import { AuthUser } from './decorators/auth-user.decorator';

@Controller()
export class AuthController {
  constructor(private usersService: UserService, private authService: AuthService) {}

  @UseGuards(LocalGuard)
  @Post('signin')
  signin(@AuthUser() user: User): SigninResponseDto {
    return this.authService.auth(user);
  }
}
