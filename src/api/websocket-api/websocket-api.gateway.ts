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
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { CommandBus, QueryBus } from '@nestjs/cqrs';

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
  wsOpenedChatsData,
} from '../../common/types/websockets.types';
import { wsOpenedChatsPayloadDto } from './dto/websocket-opened-chats.dto';

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
export class WebsocketApiGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService
  ) {}

  @WebSocketServer()
  public server: Server;

  private connectedUsers: Map<string, wsConnectedUserData> = new Map();

  private openedChats: Map<string, wsOpenedChatsData<string>> = new Map();

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
    const user = await this.checkUserAuth(client);
    // eslint-disable-next-line no-console
    console.log('user:', user);

    const connectedUser = this.getConnectedUser(user._id);
    if (connectedUser) {
      this.connectedUsers.set(user._id, { user, sockets: [...connectedUser.sockets, client.id] });
    } else {
      this.connectedUsers.set(user._id, { user, sockets: [client.id] });
    }
  }

  sendTokenAndUpdatedUser(user: AnyUserInterface, token: string) {
    const connectedUser = this.getConnectedUser(user._id);

    // если пользователь подключен, то отправляем токен на все устройства, с которых залогинен
    if (connectedUser) {
      connectedUser.sockets.forEach((clientId) => {
        this.server.sockets.sockets.get(clientId).emit(wsMessageKind.REFRESH_TOKEN_COMMAND, {
          data: {
            user,
            token,
          } as wsTokenPayload,
        } as wsMessageData);
      });

      // обновление объекта подключенного пользователя
      this.connectedUsers.set(user._id, { user, sockets: [...connectedUser.sockets] });
    }
  }

  async handleDisconnect(@ConnectedSocket() client: Socket) {
    const user = await this.checkUserAuth(client);

    const connectedUser = this.getConnectedUser(user._id);
    if (connectedUser) {
      const sockets = connectedUser.sockets.filter((socket) => socket !== client.id);
      if (sockets.length > 0) {
        this.connectedUsers.set(user._id, { user, sockets });
      } else {
        this.connectedUsers.delete(user._id);

        client.broadcast.emit(wsMessageKind.DISCONNECTION_EVENT, {
          data: {
            userId: user._id,
          } as wsDisconnectionPayload,
        } as wsMessageData);
      }
    }
  }

  private async checkUserAuth(client: Socket): Promise<AnyUserInterface | null> {
    let user: AnyUserInterface;
    try {
      user = await this.jwtService.verifyAsync(client.handshake.headers.authorization, {
        secret: this.configService.get<string>('jwt.key'),
      });
    } catch (error) {
      this.disconnect(client, { type: UnauthorizedException.name, message: error.message });
    }

    return user || null;
  }

  private getConnectedUser(userId: string): wsConnectedUserData | null {
    const connectedUser = this.connectedUsers.get(userId);
    return connectedUser || null;
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

  @SubscribeMessage(wsMessageKind.OPEN_CHAT_EVENT)
  async handleOpenChat(
    @MessageBody('data') data: wsOpenedChatsPayloadDto,
    @ConnectedSocket() client: Socket
  ) {
    const user = await this.checkUserAuth(client);
    const { chatId } = data;
    // пробуем найти уже такой открытый чат в мапе openedChats и далее проверяем по случаям
    let openedChat = this.openedChats.get(chatId);

    // ключ chatId отсутствует в OpenedChats
    if (!openedChat) {
      // добавить в мапу новую пару ключ-значение
      openedChat = { [user._id]: [client.id] };
    } else if (!openedChat[user._id]) {
      // ключ chatId есть в OpenedChats, но openedChat[userId] не существует
      // добавить в объект openedChat новое свойство
      openedChat[user._id] = [client.id];
    } else {
      // добавить в значение openedChat[userId] новый элемент
      // ключ chatId есть в OpenedChats и openedChat[userId] существует
      const userSockets = openedChat[user._id];
      if (userSockets.includes(client.id)) {
        return;
      }
      userSockets.push(client.id);
      openedChat[user._id] = userSockets;
    }

    // обновляем мапу
    this.openedChats.set(chatId, openedChat);
  }

  @SubscribeMessage(wsMessageKind.CLOSE_CHAT_EVENT)
  async handleCloseChat(
    @MessageBody('data') data: wsOpenedChatsPayloadDto,
    @ConnectedSocket() client: Socket
  ) {
    const user = await this.checkUserAuth(client);
    const { chatId } = data;
    const openedChat = this.openedChats.get(chatId);

    // получаем все соединения пользователя
    const userSockets = openedChat[user._id];

    if (userSockets.length > 1) {
      const updatedSockets = userSockets.filter((socketId) => socketId !== client.id);
      openedChat[user._id] = updatedSockets;
      this.openedChats.set(chatId, openedChat);
    } else {
      delete openedChat[user._id];

      // если других пользователей в чате нет, то удаляем чам
      if (Object.keys(openedChat).length === 0) {
        this.openedChats.delete(chatId);
      } else {
        // в противном случае обновим данные для этого чата
        this.openedChats.set(chatId, openedChat);
      }
    }
  }
}
