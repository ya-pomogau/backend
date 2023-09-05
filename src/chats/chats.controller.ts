import { Controller, Post, Param, Get, Delete } from '@nestjs/common';
import { ChatsService } from './chats.service';
import { Chat } from './entities/chat.entity';

@Controller('chats')
export class ChatsController {
  constructor(private chatsService: ChatsService) {}

  @Post()
  async createChat(): Promise<Chat> {
    return this.chatsService.createChat();
  }

  @Get(':id')
  async getChat(@Param('id') id: string): Promise<Chat | undefined> {
    return this.chatsService.getChatById(id);
  }

  // Этот эндпоинт вызывает метод для удаления истекших чатов
  @Delete('deleteExpiredChats')
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
  async deleteMessage(
    @Param('chatId') chatId: string,
    @Param('messageId') messageId: string
  ): Promise<void> {
    await this.chatsService.deleteMessage(chatId, messageId);
  }
}
