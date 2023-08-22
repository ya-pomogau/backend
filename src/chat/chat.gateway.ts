import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';

export interface ClienToServerListen {
  message: () => void
}

@WebSocketGateway({
  namespace: 'chat',
  cors: {
    origin: '*',
  },
})
export class ChatGateway {
  @WebSocketServer() server: Server;
}
