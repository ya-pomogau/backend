import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-vkontakte';
import { Injectable } from '@nestjs/common';

/**
 * @deprecated use JwtStrategy
 */

@Injectable()
export class VkontakteStrategy extends PassportStrategy(Strategy, 'vkontakte') {
  constructor() {
    super({
      clientID: 'APP_ID',
      clientSecret: 'APP_SECRET',
      callbackURL: 'CALLBACK_URL',
    });
  }

  // async validate(accessToken: string, refreshToken: string, profile: any) {
  //   return {
  //     vkId: profile.id,
  //     accessToken,
  //     name: profile.displayName,
  //     // добавить сохранение данных в монго
  //   };
  // }
}
