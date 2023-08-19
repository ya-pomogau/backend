/* eslint-disable class-methods-use-this */
import { WebSocketGateway, SubscribeMessage, WebSocketServer } from '@nestjs/websockets';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Server, Socket } from 'socket.io';
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
  async handleMessage(
    client: any,
    data: { chatId: string; sender: string; recipient: string; text: string }
  ) {
    const { chatId } = data;
    const chat = await this.chatRepository.findOne({
      where: {
        _id: new ObjectId(chatId),
      },
    });

    if (chat) {
      const newMessage = {
        sender: data.sender,
        recipient: data.recipient,
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
  async createChat(client: any, name: string) {
    const chat = this.chatRepository.create({ name, messages: [] });
    await this.chatRepository.save(chat);
    this.server.emit('chatCreated', chat);
  }
}
