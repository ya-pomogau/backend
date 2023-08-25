import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
// eslint-disable-next-line import/no-extraneous-dependencies
import { Server, Socket } from 'socket.io';
import { ChatsService } from './chat.service';

export interface Message {
  id: number;
  socketId: string;
  isFrom: boolean;
}

export interface ClientToServerListen {
  message: (message: Message) => void;
}

export interface ServerToClientListen {
  message: (message: Message) => void;
}

@WebSocketGateway({
  namespace: 'chatZ',
  cors: {
    origin: '*',
  },
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(private chatService: ChatsService) {}

  @WebSocketServer() server: Server<ClientToServerListen, ServerToClientListen>;

  @SubscribeMessage('message')
  handleMessage(@MessageBody() message: Message): void {
    this.server.emit('message', message);
  }

  handleConnection(@ConnectedSocket() client: Socket) {
    this.chatService.addClient(client);
  }

  handleDisconnect(@ConnectedSocket() client: Socket) {
    this.chatService.remoteClient(client.id);
    client.disconnect(true);
  }
}
