/* eslint-disable max-classes-per-file */
import { UnauthorizedException, UseGuards, UsePipes } from '@nestjs/common';
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
import { IsArray, IsNotEmpty, IsObject, IsString } from 'class-validator';

import configuration from '../../config/configuration';
import { SocketAuthGuard } from '../../common/guards/socket-auth.guard';
import { SocketValidationPipe } from '../../common/pipes/socket-validation.pipe';
import { AnyUserInterface } from '../../common/types/user.types';
import {
  wsMessageData,
  wsMessageKind,
  wsConnectedUserData,
  wsDisconnectionPayload,
  wsTokenPayload,
} from '../../common/types/websockets.types';

// Интерфейс и dto созданы для тестирования SocketValidationPipe
// Удалить на этапе, когда будут реализованы необходимые dto
interface TestEventMessageInterface {
  string: string;
  object: object;
  array: Array<string>;
}
class TestEventMessageDto implements TestEventMessageInterface {
  @IsString()
  @IsNotEmpty()
  string: string;

  @IsObject()
  @IsNotEmpty()
  object: object;

  @IsArray()
  @IsNotEmpty()
  array: Array<string>;
}

@UseGuards(SocketAuthGuard)
@UsePipes(SocketValidationPipe)
@WebSocketGateway(configuration().server.ws_port, {
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

  private connectedUsers: Map<string, wsConnectedUserData> = new Map();

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
  // eslint-disable-next-line consistent-return
  async handleConnection(@ConnectedSocket() client: Socket): Promise<void> {
    let user: AnyUserInterface;
    try {
      user = await this.jwtService.verifyAsync(client.handshake.headers.authorization, {
        secret: this.configService.get<string>('jwt.key'),
      });
    } catch (error) {
      return this.disconnect(client, { type: UnauthorizedException.name, message: error.message });
    }
    // eslint-disable-next-line no-console
    console.log('user:', user);

    if (this.connectedUsers.has(user._id)) {
      const currentSockets = this.connectedUsers.get(user._id).sockets;
      this.connectedUsers.set(user._id, { user, sockets: [...currentSockets, client.id] });
    }
    this.connectedUsers.set(user._id, { user, sockets: [client.id] });
  }

  sendTokenAndUpdatedUser(user: AnyUserInterface, token: string) {
    const connectedUserData: wsConnectedUserData = this.connectedUsers.get(user._id);

    // если пользователь подключен, то отправляем токен на все устройства, с которых залогинен
    if (connectedUserData) {
      connectedUserData.sockets.forEach((clientId) => {
        this.server.sockets.sockets.get(clientId).emit(wsMessageKind.REFRESH_TOKEN_COMMAND, {
          data: {
            user,
            token,
          } as wsTokenPayload,
        } as wsMessageData);
      });

      // обновление объекта подключенного пользователя
      this.connectedUsers.set(user._id, { user, ...connectedUserData });
    }
  }

  async handleDisconnect(@ConnectedSocket() client: Socket) {
    const user: AnyUserInterface = await this.jwtService.verifyAsync(
      client.handshake.headers.authorization,
      {
        secret: this.configService.get<string>('jwt.key'),
      }
    );

    client.broadcast.emit(wsMessageKind.DISCONNECTION_EVENT, {
      data: {
        userId: user._id,
      } as wsDisconnectionPayload,
    } as wsMessageData);

    const sockets = this.connectedUsers
      .get(user._id)
      .sockets.filter((socket) => socket !== client.id);

    if (sockets.length > 0) {
      this.connectedUsers.set(user._id, { user, sockets });
    }
    this.connectedUsers.delete(user._id);
  }

  private disconnect(socket: Socket, error: Record<string, unknown>) {
    socket.emit('error', new WsException(error));
    socket.disconnect();
  }

  @SubscribeMessage('test_event')
  handleTestEvent(@MessageBody('data') data: TestEventMessageDto) {
    // eslint-disable-next-line no-console
    console.log('This is test event data:', data);
  }
}
