/* eslint-disable class-methods-use-this */
import { WebSocketGateway, SubscribeMessage, WebSocketServer } from '@nestjs/websockets';
import { Repository } from 'typeorm';
import { BadRequestException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { v4 as uuidv4 } from 'uuid';
import { Server } from 'socket.io';
import { ObjectId } from 'mongodb';
import { ApiTags, ApiResponse, ApiOperation } from '@nestjs/swagger';
import { Chat } from './entities/chat.entity';
import { disconnectionChatTime } from '../common/constants';
import exceptions from '../common/constants/exceptions';

@ApiTags('Chat')
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

  private clientTimers = new Map<string, NodeJS.Timeout>(); // Добавляем Map для таймеров клиентов

  @ApiOperation({ summary: 'Установка соединения' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Успешное соединение' })
  @SubscribeMessage('connection')
  handleConnection(client: { disconnect: () => void; id: string }) {
    // Когда клиент подключается, создаем таймер для него
    const timer = setTimeout(() => {
      // Если клиент не активен в течение 5 минут, разрываем соединение
      client.disconnect();
    }, disconnectionChatTime);

    // Сохраняем таймер в Map, связывая его с идентификатором клиента (например, с его сессией)
    this.clientTimers.set(client.id, timer);
  }

  @ApiOperation({ summary: 'Отправка сообщения' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Сообщение отправлено' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Некорректные данные' })
  @SubscribeMessage('message')
  async handleMessage(
    client: { disconnect: () => void; id: string },
    data: { chatId: string; sender: string; text: string }
  ) {
    if (!data.chatId) {
      throw new BadRequestException(exceptions.chats.noId);
    }
    if (!data.sender) {
      throw new BadRequestException(exceptions.chats.noSender);
    }
    if (!data.text) {
      throw new BadRequestException(exceptions.chats.isEmpty);
    }
    // Когда клиент отправляет сообщение, сбрасываем таймер
    const timer = this.clientTimers.get(client.id);
    if (timer) {
      clearTimeout(timer);
      // Создаем новый таймер для клиента
      const newTimer = setTimeout(() => {
        // Если клиент не активен в течение 5 минут после последнего сообщения, разрываем соединение
        client.disconnect();
      }, disconnectionChatTime); // 5 минут в миллисекундах
      // Обновляем таймер в Map
      this.clientTimers.set(client.id, newTimer);
    }

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

  @ApiOperation({ summary: 'Создать чат' })
  @ApiResponse({ status: 200, description: 'Чат создан' })
  @SubscribeMessage('createChat')
  async createChat() {
    const chat = this.chatRepository.create({ messages: [] });
    await this.chatRepository.save(chat);
    this.server.emit('chatCreated', chat);
  }
}
