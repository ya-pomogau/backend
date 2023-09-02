import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Socket } from 'socket.io';
import { Repository } from 'typeorm';
import { Chat } from './entities/chat.entity';

@Injectable()
export class ChatsService {
  constructor(
    @InjectRepository(Chat)
    private readonly chatsRepository: Repository<Chat>
  ) {}

  #clients: Socket[] = [];

  addClient(client: Socket): void {
    this.#clients.push(client);
  }

  async saveChat(message) {
    const chat = await this.chatsRepository.save(message);
    return chat;
  }

  async getChat() {
    const chat = await this.chatsRepository.find();
    return chat;
  }

  remoteClient(id: string) {
    this.#clients = this.#clients.filter((client) => client.id !== id);
    console.log(this.#clients.length);
  }

  getClientId(id: string): Socket | null {
    return this.#clients.find((client) => client.id === id);
  }
}
