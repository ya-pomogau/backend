import { Injectable } from '@nestjs/common';
// eslint-disable-next-line import/no-extraneous-dependencies
import { Socket } from 'socket.io';

@Injectable()
export class ChatService {
  #clients: Socket[];

  addClient(client: Socket): void {
    this.#clients.push(client);
  }

  remoteClient(id: string) {
    this.#clients = this.#clients.filter((client) => client.id !== id);
    console.log(this.#clients.length);
  }

  getClientId(id: string): Socket | null {
    return this.#clients.find((client) => client.id === id);
  }
}
