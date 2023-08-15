import { Message } from './messages-type';

export interface ClientToServerListen {
  message: (message: Message) => void;
}

export interface ServerToClientListen {
  message: (message: Message) => void;
}
