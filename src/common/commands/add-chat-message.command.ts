import { MessageInterface } from '../types/chats.types';

export class AddChatMessageCommand {
  constructor(public readonly message: Omit<MessageInterface, '_id' | 'createdAt'>) {}
}
