import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';

@Injectable()
export class ChatsService {
  #clients: Socket[] = [];

  addClient(client: Socket): void {
    this.#clients.push(client);
    console.log(this.#clients.length);
  }

  removeClient(id: string) {
    this.#clients = this.#clients.filter((client) => client.id !== id);
    console.log(this.#clients.length);
  }

  getClientId(id: string): Socket | null {
    return this.#clients.find((client) => client.id === id);
  }
}
