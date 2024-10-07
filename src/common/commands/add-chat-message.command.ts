import { NewMessageInterface } from '../types/chats.types';

export class AddChatMessageCommand {
  constructor(public readonly message: NewMessageInterface) {}
}
