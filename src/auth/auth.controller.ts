import { Controller, Get, HttpStatus, Post, Query, Res, UseGuards } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiOkResponse,
  ApiQuery,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import type { Response } from 'express';
import exceptions from '../common/constants/exceptions';
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

@ApiTags('Auth')
@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

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
  @ApiQuery({
    type: LoginVkQueryDto,
  })
  @ApiResponse({
    status: HttpStatus.MOVED_PERMANENTLY,
  })
  @ApiUnauthorizedResponse({
    type: ApiUnauthorized,
  })
  @ApiBadRequestResponse({
    schema: {
      type: 'string',
      example: exceptions.auth.roleRequired,
    },
  })
  @Get('login-vk')
  loginVk(@Res() res: Response, @Query() query: ILoginVkQueryDto) {
    if (!['recipient', 'volunteer'].includes(query.role)) {
      return res.status(HttpStatus.BAD_REQUEST).send(exceptions.auth.roleRequired);
    }

    return res
      .status(HttpStatus.MOVED_PERMANENTLY)
      .redirect(this.authService.getRedirectUrl(query));
  }

  /**
   * ответ вида
   *```
   * { "access_token": "XXXXXX" }
   *```
   */
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
    if (query.code) {
      try {
        return await this.authService.getAccessToken(query.code, query.role);
      } catch (err) {
        return `Произошла ошибка при получении access_token: ${err.message}`;
      }
    } else if (query.error && query.error_description) {
      return `Ошибка авторизации: ${query.error}, ${query.error_description}`;
    } else {
      return 'Неправильный код авторизации';
    }
  }

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

  @ApiOkResponse({
    status: 200,
    type: SigninResponseDto,
  })
  @UseGuards(LocalGuard)
  @Post('signin')
  async signin(@AuthUser() user: TUser): Promise<SigninResponseDto> {
    return this.authService.auth(user);
  }
}
