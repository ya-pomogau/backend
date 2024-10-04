import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { AddChatMessageCommand } from '../common/commands/add-chat-message.command';
import { WebsocketApiGateway } from '../api/websocket-api/websocket-api.gateway';
import { ChatService } from './chat/chats.service';

@CommandHandler(AddChatMessageCommand)
export class AddChatMessageHandler implements ICommandHandler<AddChatMessageCommand> {
  constructor(
    private readonly websocketApiGateway: WebsocketApiGateway,
    private readonly chatService: ChatService
  ) {}

  async execute({ chatId, message }: AddChatMessageCommand) {
    const savedMessage = await this.chatService.addMessage(chatId, message);
    return savedMessage; // this.websocketApiGateway.sendNewMessage(savedMessage, addresseeId, senderId);
  }
}
