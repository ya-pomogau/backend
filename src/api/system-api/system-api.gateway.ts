import {
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({})
export class SystemApiGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  public server: Server;

  private connectedUsers: Array<string> = [];

  @SubscribeMessage('init')
  afterInit(server: Server) {
    console.log('SystemApi socket server was initialized');
  }

  @SubscribeMessage('connect')
  handleConnection(@ConnectedSocket() client: Socket) {
    client.emit('connection', { data: { message: 'Hello!', participants: this.connectedUsers } });
    client.broadcast.emit('connection', {
      data: { message: `Hello, world! ${client.id} is online from now on!` },
    });
    this.connectedUsers.push(client.id);
  }

  @SubscribeMessage('disconnect')
  handleDisconnect(@ConnectedSocket() client: Socket) {
    this.connectedUsers.filter((id) => id !== client.id);
    client.broadcast.emit('disconnection', {
      data: { message: `Hello, world! ${client.id} has dropped connection recently!` },
    });
  }
}
