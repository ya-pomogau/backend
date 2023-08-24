import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserService } from '../users/user.service';
import { VkApiUsers } from '../vk/users';
import { EVkUser } from '../vk/users.types';
import { VK_API_HOST } from './constants';
import { Token } from './entities/token.entity';
import type { ITokenResponse, TUserRole } from './types';

@Injectable()
export class AuthService {
  constructor(
    private readonly config: ConfigService,
    private readonly httpService: HttpService,
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    @InjectRepository(Token)
    private readonly tokenRepository: Repository<Token>
  ) {}

  _getRedirectUri(redirectUri: string, role: TUserRole) {
    const uri = new URL(redirectUri);
    uri.searchParams.set('role', role);

    return uri.toString();
  }

  /**
   * Get Redirect VK Login Page
   */
  getRedirectUrl({ display, scope, responseType, role }): string {
    const { appId, redirectUri } = this.config.get('vk');
    const url = new URL(`${VK_API_HOST}/authorize`);

    url.searchParams.set('client_id', appId);
    url.searchParams.append('redirect_uri', this._getRedirectUri(redirectUri, role));
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
  async getAccessToken(code: string, role: TUserRole): Promise<{ access_token: string }> {
    const { appId, appSecret, redirectUri } = this.config.get('vk');
    const url = new URL(`${VK_API_HOST}/access_token`);

    url.searchParams.set('client_id', appId);
    url.searchParams.append('client_secret', appSecret);
    url.searchParams.append('redirect_uri', this._getRedirectUri(redirectUri, role));
    url.searchParams.append('code', code);

    const response = await this.httpService.axiosRef.get<ITokenResponse>(url.toString());

    const { access_token: accessToken, user_id: userId, expires_in: expiresIn } = response.data;

    let user = await this.userService.getUserByVkId(userId);

    // Create new user if not exists
    if (!user) {
      const vkUser = await this.getUserVK(accessToken);

      if (vkUser) {
        user = await this.userService.createUser({
          vkId: vkUser.id,
          address: vkUser.country
            ? [vkUser.country.title, vkUser.home_town].join(', ')
            : [vkUser.home_town].join(', '),
          avatar: vkUser.photo_max,
          vk: `https://vk.com/${vkUser.domain}`,
          coordinates: [],
          fullname: `${vkUser.first_name} ${vkUser.last_name}`,
          phone: '',
          role,
          status: 'activated',
        });
      } else {
        throw new Error('Пользователь не может быть создан');
      }
    }

    // Save token to mongo
    const newToken = new Token({
      token: accessToken,
      expiresIn: Number(expiresIn),
      userId: user._id,
    });

    await this.tokenRepository.save(newToken);

    return {
      access_token: await this.jwtService.signAsync(
        {
          // @todo which information will be needed
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

  /**
   * Get Current User from Mongodb
   */
  getUserMongo(userId: string) {
    return this.userService.findUserById(userId);
  }
}
