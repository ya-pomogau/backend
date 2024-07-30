import { UnauthorizedException, UseGuards } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import {
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsException,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { AnyUserInterface } from '../../common/types/user.types';
import { SocketAuthGuard } from '../../common/guards/socket-auth.guard';

@UseGuards(SocketAuthGuard)
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

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  afterInit(server: Server) {
    // eslint-disable-next-line no-console
    console.log('SystemApi socket server was initialized');
  }

  /**
   * Хук, который срабатывает при подключении к сокету.
   * @param {Socket} client Данные о текущем подключившемся пользователе
   * @example http://localhost:3001
   * @headers {authorization} value Токен пользователя
   */
  async handleConnection(@ConnectedSocket() client: Socket): Promise<void> {
    let payload: AnyUserInterface;
    try {
      payload = await this.jwtService.verifyAsync(client.handshake.headers.authorization, {
        secret: this.configService.get<string>('jwt.key'),
      });
    } catch (error) {
      return this.disconnect(client, { type: UnauthorizedException.name, message: error.message });
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
    // eslint-disable-next-line no-console
    console.log('This is test event');
  }

  handleDisconnect(@ConnectedSocket() client: Socket) {
    const connectedUser = this.connectedUsers.get(client.id);

    client.broadcast.emit('disconnection', {
      data: {
        message: `Hello, world! ${
          connectedUser?.name || client.id
        } has dropped connection recently!`,
      },
    });
  }

  private disconnect(socket: Socket, error: Record<string, unknown>) {
    socket.emit('error', new WsException(error));
    socket.disconnect();
  }
}
