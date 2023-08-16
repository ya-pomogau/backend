import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { AxiosResponse } from 'axios';

@Injectable()
export class AuthService {
  constructor(private readonly httpService: HttpService) {}

  async getAccessToken(
    code: string,
    appId: string,
    appSecret: string,
    redirectUrl: string
  ): Promise<any> {
    const url = `https://oauth.vk.com/access_token?client_id=${appId}&client_secret=${appSecret}&redirect_uri=${redirectUrl}&code=${code}`;

    const response: AxiosResponse = await this.httpService.get(url).toPromise();
    const { accessToken, expiresIn, userId } = response.data;

    // сохраняем в монгу

    return {
      accessToken,
      expiresIn,
      userId,
    };
  }
}
