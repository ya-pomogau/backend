/* eslint-disable class-methods-use-this */
import {
  WebSocketGateway,
  SubscribeMessage,
  WebSocketServer,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ClientToServerListen, ServerToClientListen } from '../common/types/chat-types';
import { Message } from '../common/types/messages-type';
import { ChatsService } from './chats.service';

@WebSocketGateway({
  namespace: 'chat',
  cors: {
    origin: '*',
  },
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(private chatService: ChatsService) {}

  afterInit(server: any) {
    // console.log('Init', server);
  }

  @WebSocketServer() server: Server<ClientToServerListen, ServerToClientListen>;

  @SubscribeMessage('message')
  handleMessage(@MessageBody() message: Message): void {
    this.server.emit('message', message);
  }

  handleConnection(@ConnectedSocket() client: Socket) {
    if (!this.chatService.getClientId(client.id)) this.chatService.addClient(client);
  }

  handleDisconnect(@ConnectedSocket() client: Socket) {
    this.chatService.removeClient(client.id);
    client.disconnect(true);
  }
}
