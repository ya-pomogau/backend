import { Injectable, UnauthorizedException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { AxiosResponse } from 'axios';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../users/user.service';
import { HashService } from '../hash/hash.service';
import { User } from '../users/entities/user.entity';
import exceptions from '../common/constants/exceptions';

@Injectable()
export class AuthService {
  constructor(
    private readonly httpService: HttpService,
    private readonly jwtService: JwtService,
    private readonly usersService: UserService,
    private readonly hashService: HashService
  ) {}

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

  auth(user: User) {
    const payload = { sub: user._id };

    return { access_token: this.jwtService.sign(payload) };
  }

  async validatePassword(login: string, password: string): Promise<User | null> {
    const user = await this.usersService.getUserByLogin(login);

    if (!user) {
      throw new UnauthorizedException(exceptions.auth.unauthorized);
    }

    const isAuthorized = await this.hashService.compareHash(password, user.password);

    if (!isAuthorized) {
      throw new UnauthorizedException(exceptions.auth.unauthorized);
    }

    return isAuthorized ? user : null;
  }
}
