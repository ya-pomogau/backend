import { HttpService } from '@nestjs/axios';
import { Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { VK_API_HOST } from '../common/constants';
import exceptions from '../common/constants/exceptions';
import { HashService } from '../hash/hash.service';
import { User } from '../users/entities/user.entity';
import { UserService } from '../users/user.service';
import { VkApiUsers } from '../vk/users';
import { EVkUser, IVkUser } from '../vk/types';
import { Token } from './entities/token.entity';
import type { ITokenResponse } from './types';
import { SignupVkDto } from './dto/signup-vk-dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly config: ConfigService,
    private readonly httpService: HttpService,
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly hashService: HashService,
    @InjectRepository(Token)
    private readonly tokenRepository: Repository<Token>
  ) {}

  _getRedirectUri(redirectUri: string) {
    const uri = new URL(redirectUri);

    return uri.toString();
  }

  /**
   * Get Redirect VK Login Page
   */
  getRedirectUrl(isSignup: boolean, signupDto?: SignupVkDto): string {
    let { appId, redirectUri } = this.config.get('vk');
    const url = new URL(`${VK_API_HOST}/authorize`);

    if (isSignup) {
      redirectUri += `?signup=1&fullname=${signupDto.fullname}&role=${signupDto.role}&address=${signupDto.address}&coordinates=${signupDto.coordinates}&phone=${signupDto.phone}`;
    }

    url.searchParams.set('client_id', appId);
    url.searchParams.append('redirect_uri', this._getRedirectUri(redirectUri));
    // url.searchParams.append('display', display);
    // url.searchParams.append('scope', scope);
    // url.searchParams.append('response_type', responseType);

    return url.toString();
  }

  async getVkInfo(
    code: string,
    signupVkDto: SignupVkDto,
    isSignup: boolean
  ): Promise<{ expiresIn: number; accessToken: string; userId: number }> {
    let { appId, appSecret, redirectUri } = this.config.get('vk');
    const url = new URL(`${VK_API_HOST}/access_token`);

    if (isSignup) {
      redirectUri += `?signup=1&fullname=${signupVkDto.fullname}&role=${signupVkDto.role}&address=${signupVkDto.address}&coordinates=${signupVkDto.coordinates}&phone=${signupVkDto.phone}`;
    }

    url.searchParams.set('client_id', appId);
    url.searchParams.append('client_secret', appSecret);
    url.searchParams.append('redirect_uri', this._getRedirectUri(redirectUri));
    url.searchParams.append('code', code);

    const response = await this.httpService.axiosRef.get<ITokenResponse>(url.toString());

    const { access_token: accessToken, user_id: userId, expires_in: expiresIn } = response.data;

    return { accessToken, userId, expiresIn };
  }

  async signupViaVk(vkUser: IVkUser, signupVkDto: SignupVkDto) {
    return this.userService.createUser({
      vkId: vkUser.id,
      avatar: vkUser.photo_max,
      vkLink: `https://vk.com/${vkUser.domain}`,
      login: String(vkUser.id),
      ...signupVkDto,
      coordinates: signupVkDto.coordinates.split(',').map((str) => +str),
    });
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
  async getAccessToken(
    code: string,
    signupVkDto: SignupVkDto | null,
    isSignup: boolean
  ): Promise<{ access_token: string }> {
    const { accessToken, userId, expiresIn } = await this.getVkInfo(code, signupVkDto, isSignup);

    if (isSignup) {
      const vkUser = await this.getUserVK(accessToken);

      try {
        await this.signupViaVk(vkUser, signupVkDto);
      } catch (error) {
        console.error('Ошибка при попытке регистрации пользователя:', error);
        throw new InternalServerErrorException('Ошибка при попытке регистрации пользователя');
      }
    }

    const user = await this.userService.getUserByVkId(userId);

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
          sub: user._id,
          accessToken,
        },
        {
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

  /**
   * @todo Auth user by login and password
   */

  auth(user: User) {
    const payload = { sub: user._id };

    return { access_token: this.jwtService.sign(payload) };
  }

  /**
   * Validate password
   */
  async validatePassword(login: string, password: string): Promise<User | null> {
    const user = await this.userService.getUserByLogin(login);

    if (!user) {
      throw new UnauthorizedException(exceptions.auth.wrongLoginOrPassword);
    }

    const isAuthorized = await this.hashService.compareHash(password, user.password);

    if (!isAuthorized) {
      throw new UnauthorizedException(exceptions.auth.wrongLoginOrPassword);
    }

    return isAuthorized ? user : null;
  }
}
