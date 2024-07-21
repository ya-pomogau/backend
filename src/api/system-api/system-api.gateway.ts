// eslint-disable-next-line max-classes-per-file
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { IsNotEmpty, IsString } from 'class-validator';

// временная реализация интерфейса и dto
interface WSConnectUserInterface {
  id: string;
  name: string;
}

class WSConnectUserDto implements WSConnectUserInterface {
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsString()
  @IsNotEmpty()
  name: string;
}

@WebSocketGateway({
  cors: {
    allowedHeaders: '*'
  }
})
export class SystemApiGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  public server: Server;

  private connectedUsers: Map<string, WSConnectUserDto> = new Map();

  afterInit(server: Server) {
    console.log('SystemApi socket server was initialized');
  }

  /**
   * Хук, который срабатывает при подключении к сокету.
   * @param {Socket} client Данные о текущем подключившемся пользователе
   * @example http://localhost:3001?id=555&name=Kolya
   */
  handleConnection(@ConnectedSocket() client: Socket) {
    // На время тестирования передаём id и name пользователя в query. Позже мы будем получать данные текущего подключившегося с помощью токена
    const {id, name} = client.handshake.query as unknown as WSConnectUserDto;

    const participantsIds: Array<string> = [];
    if (this.connectedUsers.size > 0) {
      // eslint-disable-next-line no-restricted-syntax
      for (const user of this.connectedUsers.values()) {
        participantsIds.push(user.id);
      }
    }
    client.emit('connect_user', { data: { message: 'Hello!', participants: participantsIds } });
    client.broadcast.emit('connection', {
      data: { message: `Hello, world! ${name} is online from now on!` },
    });
    this.connectedUsers.set(client.id, {id, name});
  }

  @SubscribeMessage("test_event")
  handleTestEvent() {
    console.log("This is test event")
  }

  handleDisconnect(@ConnectedSocket() client: Socket) {
    const { name } = this.connectedUsers.get(client.id);
    const designation = name || client.id;
    client.broadcast.emit('disconnection', {
      data: { message: `Hello, world! ${designation} has dropped connection recently!` },
    });
  }
}
