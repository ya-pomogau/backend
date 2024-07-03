/* eslint-disable @typescript-eslint/no-empty-function */
import { Controller } from '@nestjs/common';
import { ChatService } from './entities/chats/chat.service';

@Controller()
export class AppController {
  constructor() {}
}
