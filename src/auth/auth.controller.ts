import { Controller, Get, HttpStatus, Query, Res, UseGuards } from '@nestjs/common';
import type { Response } from 'express';
import { AuthService } from './auth.service';
import { User } from './decorators/user.decorator';
import { AuthGuard } from './guards/auth.guard';
import { EDisplay, EResponseType, EScope, IJwtUser, TUserRole } from './types';

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
  @Get('login')
  loginVk(
    @Res() res: Response,
    @Query('display') display: EDisplay = EDisplay.page,
    @Query('scope') scope: EScope = EScope.friends,
    @Query('response_type') responseType: EResponseType = EResponseType.code,
    @Query('role') role: TUserRole = 'recipient'
  ) {
    if (!['recipient', 'volunteer'].includes(role)) {
      return res.status(HttpStatus.BAD_REQUEST).send('Роль должна быть recipient или volunteer');
    }

    return res
      .status(HttpStatus.MOVED_PERMANENTLY)
      .redirect(this.authService.getRedirectUrl({ display, scope, responseType, role }));
  }

  /**
   * ответ вида
   *```
   * { "access_token": "XXXXXX" }
   *```
   */
  @Get('callback')
  async callback(
    @Query('code') code?: string,
    @Query('error') error?: string,
    @Query('role') role?: TUserRole,
    @Query('error_description') errorDescription?: string
  ): Promise<{ access_token: string } | string> {
    if (code) {
      try {
        return await this.authService.getAccessToken(code, role);
      } catch (err) {
        return `Произошла ошибка при получении access_token: ${err.message}`;
      }
    } else if (error && errorDescription) {
      return `Ошибка авторизации: ${error}, ${errorDescription}`;
    } else {
      return 'Неправильный код авторизации';
    }
  }

  @Get('me')
  @UseGuards(AuthGuard)
  async me(@User() user: IJwtUser) {
    if ('accessToken' in user) {
      return this.authService.getUserVK(user.accessToken);
    }

    return this.authService.getUserMongo(user.sub);
  }
}
