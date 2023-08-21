import { Controller, Get, Query, Res, UseGuards } from '@nestjs/common';
import type { Response } from 'express';
import { User } from './decorators/user.decorator';
import { AuthService } from './auth.service';
import { EDisplay, EResponseType, EScope, IJwtUser } from './types';
import { AuthGuard } from './guards/auth.guard';

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
  login(
    @Res() res: Response,
    @Query('display') display: EDisplay = EDisplay.page,
    @Query('scope') scope: EScope = EScope.friends,
    @Query('response_type') responseType: EResponseType = EResponseType.code
  ) {
    return res
      .status(302)
      .redirect(this.authService.getRedirectUrl({ display, scope, responseType }));
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
    @Query('role') role?: string,
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
    return this.authService.getUserVK(user.accessToken);
  }
}
