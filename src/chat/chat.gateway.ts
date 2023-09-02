import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatsService } from './chat.service';
import { Message } from './entities/chat.entity';

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
  constructor(private chatService: ChatsService) {}

  @WebSocketServer() server: Server<ClientToServerListen, ServerToClientListen>;

  @SubscribeMessage('message')
  handleMessage(@MessageBody() message: Message): void {
    console.log('message', message);
    this.server.emit('message', message);

    this.chatService.saveChat(message);
  }

  async handleConnection(@ConnectedSocket() client: Socket) {
    if (!this.chatService.getClientId(client.id)) this.chatService.addClient(client);
    const chat = await this.chatService.getChat();
    console.log('chat', chat);
  }

  handleDisconnect(@ConnectedSocket() client: Socket) {
    this.chatService.remoteClient(client.id);
    client.disconnect(true);
  }
}
