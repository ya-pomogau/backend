import { Controller, Get, Redirect, Query } from '@nestjs/common';

@Controller()
export class AuthController {
  constructor(private readonly authService: any) {}

  // eslint-disable-next-line class-methods-use-this
  @Get('login')
  @Redirect()
  login(
    @Query('display') display = 'page',
    @Query('scope') scope = 'friends',
    @Query('response_type') responseType = 'code',
    @Query('state') state = ''
  ): { url: string } {
    const userId = 'USER_ID';
    const redirectUri = 'REDIRECT_URI';

    let loginUrl = 'https://oauth.vk.com/authorize';
    loginUrl += `?client_id=${userId}`;
    loginUrl += `&redirect_uri=${redirectUri}`;
    loginUrl += `&display=${display}`;
    loginUrl += `&scope=${scope}`;
    loginUrl += `&response_type=${responseType}`;
    loginUrl += `&state=${state}`;

    return { url: loginUrl };
  }

  // пример полной строки первого запроса:  https://id.vk.com/auth?app_id=51729194&state=&response_type=code&redirect_uri=http%3A%2F%2Fapi.kraev.nomoredomains.xyz&redirect_uri_hash=c14a6b2833cd867e87&code_challenge=&code_challenge_method=&return_auth_hash=1dd767d39c77b77fe3&scope=0&force_hash=

  @Get('callback')
  async callback(
    @Query('code') code?: string,
    @Query('error') error?: string,
    @Query('error_description') errorDescription?: string
  ): Promise<string> {
    if (code) {
      try {
        const appId = '51729194';
        const appSecret = 'lyxbTQRoOzpKBX4PqjWm';
        const redirectUrl = 'http://api.kraev.nomoredomains.xyz';

        const accessToken = await this.authService.getAccessToken(
          code,
          appId,
          appSecret,
          redirectUrl
        );
        // ответ вида
        // {
        //    "access_token": "vk1.a.uGAKWT34NbvlroiQf2rexPUP2YJVwormwQono4cVcI6yTkx-8_G2NeORf_H6vcmmFfwjFp1_QWufTd9JagkU0iimCG6CyhXZ5GZT-8ZULi1_6ScV-T_J7zsKpviJioLuSuJufzUP59qzeq0X4A6Wz75b7IJJCD8LT9snee6ane6nnhM5Af5kkD73sfMW9Zb_",
        //    "expires_in": 86291,
        //    "user_id": 741592163
        // }

        return 'Авторизация успешно выполнена';
      } catch (err) {
        return `Произошла ошибка при получении access_token: ${err.message}`;
      }
    } else if (error && errorDescription) {
      return `Ошибка авторизации: ${error}, ${errorDescription}`;
    } else {
      return 'Неправильный код авторизации';
    }
  }
}
