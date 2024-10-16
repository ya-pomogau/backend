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
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
    let openedChat = this.openedChats.get(chatId);

    // если чата нет, то добавляем новую запись
    if (!openedChat) {
      openedChat = { users: [user._id] };
      this.openedChats.set(chatId, openedChat);
    }

    // если чат есть, но такого пользователя там нет
    if (!openedChat.users.includes(user._id)) {
      openedChat.users.push(user._id);
      this.openedChats.set(chatId, openedChat);
    }

    // обновим информацию о подключениях пользователя в connectedUsers
    const connectedUser = this.connectedUsers.get(user._id);
    if (connectedUser) {
      // если пользователь уже подключён, добавляем новый сокет
      if (!connectedUser.sockets.includes(client.id)) {
        connectedUser.sockets.push(client.id);
      }
    } else {
      // если пользователя нет в мапе, добавляем его с новым сокетом
      this.connectedUsers.set(user._id, { user, sockets: [client.id] });
    }
    // client.emit('chat_opened', { message: `openedChat = ${JSON.stringify(openedChat)}` });
    // TODO: Сделать запрос за последними сообщениями и отправить их клиенту
  }

  @SubscribeMessage(wsMessageKind.CLOSE_CHAT_EVENT)
  async handleCloseChat(
    @MessageBody('data') data: wsOpenedChatsPayloadDto,
    @ConnectedSocket() client: Socket
  ) {
    const user = await this.checkUserAuth(client);
    const { chatId } = data;
    const openedChat = this.openedChats.get(chatId);

    // если такого чата нет
    if (!openedChat) {
      return;
    }

    // если пользователь есть в чате, то удалим его
    if (openedChat.users.includes(user._id)) {
      openedChat.users = openedChat.users.filter((userId) => userId !== user._id);

      // если после удаления пользователя в чате больше никого не осталось, то удалим чат
      if (openedChat.users.length === 0) {
        this.openedChats.delete(chatId);
      } else {
        this.openedChats.set(chatId, openedChat);
      }
    }

    const connectedUser = this.connectedUsers.get(user._id);
    if (connectedUser) {
      // если у пользователя есть другие активные подключения, то удаляем только текущий сокет
      connectedUser.sockets = connectedUser.sockets.filter((socketId) => socketId !== client.id);

      // если у пользователя не осталось активных сокетов, удаляем пользователя из connectedUsers иначе обновим данные в мапе
      if (connectedUser.sockets.length === 0) {
        this.connectedUsers.delete(user._id);
      } else {
        this.connectedUsers.set(user._id, connectedUser);
      }
    }
    // client.emit('chat_closed', { message: `openedChat = ${JSON.stringify(openedChat)}` });
  }
}
