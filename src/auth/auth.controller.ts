import { Body, Controller, Get, HttpStatus, Post, Query, Res, UseGuards } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import type { Response } from 'express';
import type { User as TUser } from '../users/entities/user.entity';
import { AuthService } from './auth.service';
import { AuthUser } from './decorators/auth-user.decorator';
import { User } from './decorators/user.decorator';
import { CallbackQueryDto } from './dto/callback.query.dto';
import { ILoginVkQueryDto, LoginVkQueryDto } from './dto/login-vk.query.dto';
import { SigninResponseDto } from './dto/signin-response.dto';
import { JwtGuard } from './guards/jwt.guard';
import { LocalGuard } from './guards/local.guard';
import type { IJwtUser } from './types';
import { ApiUnauthorized } from './types/unauthorized';
import { SignupVkDto } from './dto/signup-vk-dto';
import { UserService } from '../users/user.service';
import { SigninDto } from './dto/signin.dto';

@ApiTags('Auth')
@Controller()
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService
  ) {}

  /**
   * пример полной строки первого запроса:
   * ```
   * https://id.vk.com/auth
   * ?app_id=51729194&state=
   * &response_type=code
   * &redirect_uri=http%3A%2F%2Fapi.kraev.nomoredomains.xyz
   * &redirect_uri_hash=c14a6b2833cd867e87
   * &code_challenge=
   * &code_challenge_method=
   * &return_auth_hash=1dd767d39c77b77fe3
   * &scope=0
   * &force_hash=
   * ```
   */
  @ApiOperation({
    summary: 'Авторизация для реципиента/волонтера',
    description: 'Авторизация существуюшего в базе реципиента/волонтера через вконтакте.',
  })
  @ApiQuery({
    type: LoginVkQueryDto,
  })
  @ApiResponse({
    status: HttpStatus.MOVED_PERMANENTLY,
  })
  @ApiUnauthorizedResponse({
    type: ApiUnauthorized,
  })
  @Get('signin-vk')
  loginVk(@Res() res: Response, @Query() query: ILoginVkQueryDto) {
    return res
      .status(HttpStatus.MOVED_PERMANENTLY)
      .redirect(this.authService.getRedirectUrl(false));
  }

  @ApiOperation({
    summary: 'Регистрация для реципиента/волонтера',
    description:
      'Пользователи создаются со статусом 0 (минимальный). Невозможна повторная регистрация по существующему в базе id вконтакте.',
  })
  @ApiBody({
    type: SignupVkDto,
    description: 'Поле coordinates (только) для этой ручки должно быть в формате строки.',
  })
  @ApiResponse({
    status: HttpStatus.MOVED_PERMANENTLY,
  })
  @ApiUnauthorizedResponse({
    type: ApiUnauthorized,
  })
  @Post('signup-vk')
  signupVk(@Res() res: Response, @Body() signupVkDto: SignupVkDto) {
    return res
      .status(HttpStatus.MOVED_PERMANENTLY)
      .redirect(this.authService.getRedirectUrl(true, signupVkDto));
  }

  /**
   * ответ вида
   *```
   * { "access_token": "XXXXXX" }
   *```
   */
  @ApiOperation({
    summary: 'Ответ от вконтакте при успешной авторизации/регистрации',
    description: 'Активируется при ответе от вконтаке. Все поля заполняются автоматически.',
  })
  @ApiOkResponse({
    status: 200,
    type: SigninResponseDto,
  })
  @ApiUnauthorizedResponse({
    type: ApiUnauthorized,
  })
  @ApiBadRequestResponse({
    schema: {
      type: 'string',
      example: 'Ошибка авторизации',
    },
  })
  @Get('callback')
  async callback(@Query() query: CallbackQueryDto): Promise<SigninResponseDto | string> {
    if (!query.code) {
      if (query.error && query.error_description) {
        return `Ошибка авторизации: ${query.error}, ${query.error_description}`;
      }
      return 'Неправильный код авторизации';
    }

    let signupVkDto = null;

    if (query.signup) {
      signupVkDto = {
        fullname: query.fullname,
        role: query.role,
        address: query.address,
        phone: query.phone,
        coordinates: query.coordinates,
      };
    }

    try {
      return await this.authService.getAccessToken(query.code, signupVkDto, !!query.signup);
    } catch (err) {
      return `Произошла ошибка при получении access_token: ${err.message}`;
    }
  }

  @ApiOperation({
    summary: 'Данные о пользователе, полученные от вконтакте',
  })
  @ApiBearerAuth()
  @ApiUnauthorizedResponse({
    type: ApiUnauthorized,
  })
  @Get('me')
  @UseGuards(JwtGuard)
  async me(@User() user: IJwtUser) {
    if ('accessToken' in user) {
      return this.authService.getUserVK(user.accessToken);
    }

    return this.authService.getUserMongo(user._id.toString());
  }

  @ApiOperation({ summary: 'Авторизация для администратора' })
  @ApiBody({
    type: SigninDto,
  })
  @ApiOkResponse({
    status: 200,
    type: SigninResponseDto,
  })
  @UseGuards(LocalGuard)
  @Post('signin-admin')
  async signin(@AuthUser() user: TUser): Promise<SigninResponseDto> {
    return this.authService.auth(user);
  }
}
