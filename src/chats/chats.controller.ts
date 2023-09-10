import { Controller, Post, Param, Get, Delete } from '@nestjs/common';
import { ChatsService } from './chats.service';
import { Chat } from './entities/chat.entity';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
} from '@nestjs/swagger'; // Импортируйте аннотации Swagger

@Controller('chats')
@ApiTags('Chats') // Добавьте тег для группировки операций в документации Swagger
export class ChatsController {
  constructor(private chatsService: ChatsService) {}

  @Post()
  @ApiOperation({ summary: 'Создать чат' }) // Добавьте описание операции
  @ApiResponse({ status: 201, description: 'Чат успешно создан', type: Chat })
  async createChat(): Promise<Chat> {
    return this.chatsService.createChat();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Получить чат по ID' })
  @ApiParam({ name: 'id', description: 'ID чата', type: String })
  @ApiResponse({ status: 200, description: 'Чат найден', type: Chat })
  @ApiResponse({ status: 404, description: 'Чат не найден' })
  async getChat(@Param('id') id: string): Promise<Chat | undefined> {
    return this.chatsService.getChatById(id);
  }

  // Этот эндпоинт вызывает метод для удаления истекших чатов
  @Delete('deleteExpiredChats')
  @ApiOperation({ summary: 'Удалить истекшие чаты' })
  @ApiResponse({
    status: 200,
    description: 'Истекшие чаты успешно удалены',
    type: Object,
  })
  @ApiResponse({
    status: 500,
    description: 'Произошла ошибка при удалении истекших чатов',
    type: Object,
  })
  async deleteExpiredChats() {
    try {
      await this.chatsService.deleteExpiredChats();
      return { message: 'Истекшие чаты успешно удалены' };
    } catch (error) {
      console.error('Error deleting expired chats:', error);
      return { error: 'Произошла ошибка при удалении истекших чатов' };
    }
  }

  @Delete(':chatId/messages/:messageId')
  @ApiOperation({ summary: 'Удалить сообщение из чата' })
  @ApiParam({ name: 'chatId', description: 'ID чата', type: String })
  @ApiParam({ name: 'messageId', description: 'ID сообщения', type: String })
  @ApiResponse({ status: 200, description: 'Сообщение успешно удалено' })
  async deleteMessage(
    @Param('chatId') chatId: string,
    @Param('messageId') messageId: string
  ): Promise<void> {
    await this.chatsService.deleteMessage(chatId, messageId);
  }
}
