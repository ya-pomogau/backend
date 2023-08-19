/* eslint-disable class-methods-use-this */
import { WebSocketGateway, SubscribeMessage, WebSocketServer } from '@nestjs/websockets';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { v4 as uuidv4 } from 'uuid';
import { Server } from 'socket.io';
import { ObjectId } from 'mongodb';
import { Chat } from './entities/chat.entity';

@WebSocketGateway({
  namespace: 'chat',
  cors: {
    origin: '*',
  },
})
export class ChatGateway {
  constructor(
    @InjectRepository(Chat)
    private chatRepository: Repository<Chat>
  ) {}

  @WebSocketServer()
  server: Server;

  @SubscribeMessage('message')
  async handleMessage(client: any, data: { chatId: string; sender: string; text: string }) {
    const { chatId } = data;
    const chat = await this.chatRepository.findOne({
      where: {
        _id: new ObjectId(chatId),
      },
    });

    if (chat) {
      const newMessage = {
        id: uuidv4(),
        sender: data.sender,
        text: data.text,
        timestamp: new Date(),
      };

      if (!chat.messages) {
        chat.messages = [];
      }

      chat.messages.push(newMessage);

      await this.chatRepository.save(chat);
      this.server.emit(`chat.${chat._id}.message`, newMessage);
    }
  }

  @SubscribeMessage('createChat')
  async createChat() {
    const chat = this.chatRepository.create({ messages: [] });
    await this.chatRepository.save(chat);
    this.server.emit('chatCreated', chat);
  }
}
