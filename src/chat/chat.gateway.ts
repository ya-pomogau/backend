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
import { ChatService } from './chat.service';

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
  namespace: 'chat',
  cors: {
    origin: '*',
  },
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(private charService: ChatService) {}

  @WebSocketServer() server: Server<ClientToServerListen, ServerToClientListen>;

  @SubscribeMessage('message')
  handleMessage(@MessageBody() message: Message): void {
    this.server.emit('message', message);
  }

  handleConnection(@ConnectedSocket() client: Socket) {
    if (this.charService.getClientId(client.id)) this.charService.addClient(client);
  }

  handleDisconnect(@ConnectedSocket() client: Socket) {
    this.charService.remoteClient(client.id);
    client.disconnect(true);
  }
}
