import { NewMessageInterface } from '../types/chats.types';

export class AddChatMessageCommand {
  constructor(
    public readonly chatId: string,
    public readonly message: Omit<NewMessageInterface, 'chatId'>
  ) {}
}
