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

import { AnyUserInterface } from '../../common/types/user.types';
import { SocketAuthGuard } from '../../common/guards/socket-auth.guard';
import { SocketValidationPipe } from '../../common/pipes/socket-validation.pipe';
import { Recipient } from '../../datalake/users/schemas/recipient.schema';
import { Admin } from '../../datalake/users/schemas/admin.schema';
import { Volunteer } from '../../datalake/users/schemas/volunteer.schema';

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
  // eslint-disable-next-line consistent-return
  async handleConnection(@ConnectedSocket() client: Socket): Promise<void> {
    let payload: AnyUserInterface;
    try {
      payload = await this.jwtService.verifyAsync(client.handshake.headers.authorization, {
        secret: this.configService.get<string>('jwt.key'),
      });
    } catch (error) {
      return this.disconnect(client, { type: UnauthorizedException.name, message: error.message });
    }
    // eslint-disable-next-line no-console
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

  sendToken(user: Recipient | Admin | Volunteer | Record<string, unknown>, token: string) {
    let clientId: string;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    this.connectedUsers.forEach((value, key, map) => {
      if (value._id === user._id) {
        clientId = key;
      }
    });

    if (clientId) {
      this.server.sockets.sockets.get(clientId).emit('new_token', {
        data: {
          message: `The user's status has changed. The token must be replaced.`,
          token,
        },
      });
    }
  }

  @SubscribeMessage('test_event')
  handleTestEvent(@MessageBody('data') data: TestEventMessageDto) {
    // eslint-disable-next-line no-console
    console.log('This is test event data:', data);
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

    this.connectedUsers.delete(client.id);
  }

  private disconnect(socket: Socket, error: Record<string, unknown>) {
    socket.emit('error', new WsException(error));
    socket.disconnect();
  }
}
