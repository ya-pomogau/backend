import { Controller, Post, Body, Param, Get } from '@nestjs/common';
import { ChatsService } from './chats.service';
import { CreateChatDto } from './dto/create-chat.dto';
import { Chat } from './entities/chat.entity';

@Controller('chats')
export class ChatsController {
  constructor(private chatsService: ChatsService) {}

  @Post()
  async createChat(@Body() createChatDto: CreateChatDto): Promise<Chat> {
    return this.chatsService.createChat(createChatDto.name);
  }

  @Get(':id')
  async getChat(@Param('id') id: string): Promise<Chat | undefined> {
    return this.chatsService.getChatById(id);
  }
}
