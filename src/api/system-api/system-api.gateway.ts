// eslint-disable-next-line max-classes-per-file
import { UnauthorizedException, UseGuards } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsException,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import exceptions from '../../common/constants/exceptions';
import { AnyUserInterface } from '../../common/types/user.types';
import { SocketAuthGuard } from '../../common/guards/socket-auth.guard';

@WebSocketGateway({
  cors: {
    allowedHeaders: '*',
  },
})
export class SystemApiGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService
  ) {}

  @WebSocketServer()
  public server: Server;

  private connectedUsers: Map<string, AnyUserInterface> = new Map();

  afterInit(server: Server) {
    console.log('SystemApi socket server was initialized');
  }

  /**
   * Хук, который срабатывает при подключении к сокету.
   * @param {Socket} client Данные о текущем подключившемся пользователе
   * @example http://localhost:3001?id=555&name=Kolya
   */
  @UseGuards(SocketAuthGuard)
  async handleConnection(@ConnectedSocket() client: Socket) {
    const token = client.handshake.headers.authorization;
    if (!token) {
      throw new UnauthorizedException(exceptions.auth.unauthorized);
    }

    let payload: AnyUserInterface;
    try {
      payload = await this.jwtService.verifyAsync(token, {
        secret: this.configService.get<string>('jwt.key'),
      });
    } catch (error) {
      throw new WsException({
        error,
        message: 'Ошибка верификации токена при установлении websocket-соединения',
      });
    }
    console.log('user:', payload);

    const participantsIds: Array<string> = [];
    if (this.connectedUsers.size > 0) {
      // eslint-disable-next-line no-restricted-syntax
      for (const user of this.connectedUsers.values()) {
        participantsIds.push(user._id);
      }
    }

    client.emit('connect_user', { data: { message: 'Hello!', participants: participantsIds } });
    client.broadcast.emit('connection', {
      data: { message: `Hello, world! ${payload.name} is online from now on!` },
    });

    this.connectedUsers.set(client.id, payload);
  }

  @SubscribeMessage('test_event')
  handleTestEvent() {
    console.log('This is test event');
  }

  handleDisconnect(@ConnectedSocket() client: Socket) {
    const { name } = this.connectedUsers.get(client.id);
    const designation = name || client.id;
    client.broadcast.emit('disconnection', {
      data: { message: `Hello, world! ${designation} has dropped connection recently!` },
    });
  }
}
