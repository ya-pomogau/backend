import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { WsException } from '@nestjs/websockets';
import { AnyUserInterface } from '../types/user.types';
import exceptions from '../constants/exceptions';

@Injectable()
export class SocketAuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    console.log('canActivate');
    const token = context.getArgs()[0].handshake.headers.authorization;
    if (!token) {
      throw new UnauthorizedException(exceptions.auth.unauthorized);
    }

    try {
      const payload: AnyUserInterface = await this.jwtService.verifyAsync(token, {
        secret: this.configService.get<string>('jwt.key'),
      });

      context.switchToWs().getData().user = payload;
    } catch (error) {
      throw new WsException({
        error,
        message: 'Ошибка верификации токена при установлении websocket-соединения',
      });
    }

    return true;
  }
}
