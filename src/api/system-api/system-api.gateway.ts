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

@WebSocketGateway({})
export class SystemApiGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  public server: Server;

  private connectedUsers: Map<string, WSConnectUserDto> = new Map();

  @SubscribeMessage('init')
  afterInit(server: Server) {
    console.log('SystemApi socket server was initialized');
  }

  @SubscribeMessage('connect')
  handleConnection(@ConnectedSocket() client: Socket, @MessageBody() user: WSConnectUserDto) {
    const participantsIds: Array<string> = [];
    if (this.connectedUsers.size > 0) {
      // eslint-disable-next-line no-restricted-syntax
      for (const user of this.connectedUsers.values()) {
        participantsIds.push(user.id);
      }
    }
    client.emit('connection', { data: { message: 'Hello!', participants: participantsIds } });
    client.broadcast.emit('connection', {
      data: { message: `Hello, world! ${user.name} is online from now on!` },
    });
    this.connectedUsers.set(client.id, user);
  }

  @SubscribeMessage('disconnect')
  handleDisconnect(@ConnectedSocket() client: Socket) {
    const { name } = this.connectedUsers.get(client.id);
    const designation = name || client.id;
    client.broadcast.emit('disconnection', {
      data: { message: `Hello, world! ${designation} has dropped connection recently!` },
    });
  }
}
