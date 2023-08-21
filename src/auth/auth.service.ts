import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../users/user.service';
import { VkApiUsers } from '../vk/users';
import { EVkUser } from '../vk/users.types';
import { VK_API_HOST } from './constants';
import type { ITokenResponse } from './types';

@Injectable()
export class AuthService {
  constructor(
    private readonly config: ConfigService,
    private readonly httpService: HttpService,
    private readonly user: UserService,
    private readonly jwt: JwtService
  ) {}

  /**
   * Get Redirect VK Login Page
   */
  getRedirectUrl({ display, scope, responseType }): string {
    const { appId, redirectUri } = this.config.get('vk');
    const url = new URL(`${VK_API_HOST}/authorize`);

    url.searchParams.set('client_id', appId);
    url.searchParams.append('redirect_uri', redirectUri); // @todo api.host/callback?who=volunteer
    url.searchParams.append('display', display);
    url.searchParams.append('scope', scope);
    url.searchParams.append('response_type', responseType);

    return url.toString();
  }

  /**
   * Request example url
   * ```text
   * https://oauth.vk.com/access_token
   * ?client_id=51729194
   * &client_secret=lyxbTQRoOzpKBX4PqjWm
   * &redirect_uri=https%3A%2F%2Fapi.kraev.nomoredomains.xyz%
   * &code=4354000945c8f83fa6
   * ```
   *  Response API
   * ```json
   * {"access_token":"vk1.a.XXXXXXX","expires_in":86389,"user_id":817575562}
   * ```
   */
  async getAccessToken(code: string, role: string): Promise<{ access_token: string }> {
    const { appId, appSecret, redirectUri } = this.config.get('vk');
    const url = new URL(`${VK_API_HOST}/access_token`);

    url.searchParams.set('client_id', appId);
    url.searchParams.append('client_secret', appSecret);
    url.searchParams.append('redirect_uri', redirectUri);
    url.searchParams.append('code', code);

    const response = await this.httpService.axiosRef.get<ITokenResponse>(url.toString());

    const { access_token: accessToken, user_id: userId, expires_in: expiresIn } = response.data;

    let user = await this.user.getUserByVkId(userId);

    // Create new user if not exists
    if (!user) {
      const vkUser = await this.getUserVK(accessToken);

      if (vkUser) {
        user = await this.user.createUser({
          vkId: vkUser.id,
          address: vkUser.country
            ? [vkUser.country.title, vkUser.home_town].join(', ')
            : [vkUser.home_town].join(', '),
          avatar: vkUser.photo_max,
          vk: `https://vk.com/${vkUser.domain}`,
          coordinates: [],
          fullname: `${vkUser.first_name} ${vkUser.last_name}`,
          phone: '',
          role: 'volunteer', // @todo default role?
          status: 'activated', // @todo default status?
        });
      } else {
        throw new Error('Пользователь не может быть создан');
      }
    }

    return {
      access_token: await this.jwt.signAsync(
        {
          sub: user._id,
          vkId: user.vkId,
          role: user.role,
          accessToken,
        },
        {
          secret: this.config.get('jwt.secret'),
          expiresIn,
        }
      ),
    };
  }

  /**
   * Get Current User from VK
   */
  async getUserVK(accessToken: string) {
    const usersApi = new VkApiUsers(this.httpService, accessToken);
    const { response } = await usersApi.get([
      EVkUser.bdate,
      EVkUser.city,
      EVkUser.has_photo,
      EVkUser.photo_max,
      EVkUser.has_mobile,
      EVkUser.home_town,
      EVkUser.sex,
      EVkUser.domain,
    ]);
    const [user] = response;

    return user;
  }
}
