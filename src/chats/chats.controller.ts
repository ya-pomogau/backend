import { Controller, Post, Param, Get, Delete, UseGuards, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBearerAuth } from '@nestjs/swagger'; // Импортируйте аннотации Swagger
import { ChatsService } from './chats.service';
import { Chat } from './entities/chat.entity';
import { JwtGuard } from '../auth/guards/jwt.guard';

@Controller('chats')
@ApiTags('Chats')
@ApiBearerAuth()
@UseGuards(JwtGuard)
export class ChatsController {
  constructor(private chatsService: ChatsService) {}

  @Post()
  @ApiOperation({ summary: 'Создание чата' }) // Добавьте описание операции
  @ApiResponse({ status: HttpStatus.CREATED, type: Chat })
  async createChat(): Promise<Chat> {
    return this.chatsService.createChat();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Поиск чата по id' })
  @ApiParam({ name: 'id', description: 'строка из 24 шестнадцатеричных символов', type: String })
  @ApiResponse({ status: HttpStatus.OK, description: 'Чат найден', type: Chat })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Чат не найден' })
  async getChat(@Param('id') id: string): Promise<Chat | undefined> {
    return this.chatsService.getChatById(id);
  }

  // Этот эндпоинт вызывает метод для удаления истекших чатов
  @Delete('deleteExpiredChats')
  @ApiOperation({ summary: 'Удаление истекших чатов' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Истекшие чаты успешно удалены',
    type: Object,
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
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
  @ApiOperation({ summary: 'Удаление сообщения из чата' })
  @ApiParam({
    name: 'chatId',
    description: 'строка из 24 шестнадцатеричных символов',
    type: String,
  })
  @ApiParam({
    name: 'messageId',
    description: 'строка из 24 шестнадцатеричных символов',
    type: String,
  })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'Сообщение успешно удалено' })
  async deleteMessage(
    @Param('chatId') chatId: string,
    @Param('messageId') messageId: string
  ): Promise<void> {
    await this.chatsService.deleteMessage(chatId, messageId);
  }
}
