import { Body, Controller, Post, UseGuards, ValidationPipe } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { UserService } from '../users/user.service';
import { AuthService } from './auth.service';
import { LocalGuard } from './guards/local.guard';
import { User } from '../users/entities/user.entity';
import { SigninResponseDto } from './dto/signin-response.dto';
import { AuthUser } from './decorators/auth-user.decorator';
import { SigninDto } from './dto/signin.dto';

@ApiTags('Login')
@Controller()
export class AuthController {
  constructor(private usersService: UserService, private authService: AuthService) {}

  @ApiOkResponse({
    status: 200,
    type: SigninResponseDto,
  })
  @UseGuards(LocalGuard)
  @Post('signin')
  async signin(@AuthUser() user: User, @Body() signinDto: SigninDto): Promise<SigninResponseDto> {
    return this.authService.auth(user);
  }
}
