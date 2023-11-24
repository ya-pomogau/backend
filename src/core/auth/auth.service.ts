/* eslint-disable camelcase */
import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { JwtService } from '@nestjs/jwt';
import { UsersRepository } from '../../datalake/users/users.repository';
import { UsersService } from '../users/users.service';
import { VKLoginDtoInterface, VKResponseInterface } from '../../common/types/api.types';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersRepo: UsersRepository,
    private readonly usersService: UsersService,
    private readonly httpService: HttpService,
    private readonly
  ) {}

  async authenticate(payload: Record<string, unknown>): Promise<string> {
    // TODO: возвращаем шифрованный payload просто :)
  }

  async loginUser(dto: VKLoginDtoInterface) {
    const { code, redirectUrl } = dto;
    const vkAuthUrl = `https://oauth.vk.com/access_token?client_id=51798618&client_secret=898A5ISDAGmscLIFz0JV&redirect_uri=${redirectUrl}&code=${code}`;
    const {
      // eslint-disable-next-line camelcase
      data: { user_id: vkId, expires_in, access_token },
    } = await this.httpService.get<VKResponseInterface>(vkAuthUrl);
    const vkUserUrl = `https://api.vk.com/method/users.get?access_token=${access_token}=5.131`;
    const vkUser = await this.httpService.get(vkUserUrl);
    const user = this.usersRepo.checkVKCredential(vkId);
    if (user) {
      const token = this.authenticate(user);
      return { user, token };
    }
    // eslint-disable-next-line camelcase

    return { vkUser };
  }
}
