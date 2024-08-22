import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { SendTokenCommand } from '../common/commands/send-token.command';
import { SystemApiGateway } from '../api/system-api/system-api.gateway';

@CommandHandler(SendTokenCommand)
export class SendTokenHandler implements ICommandHandler<SendTokenCommand> {
  constructor(private readonly systemApiGateway: SystemApiGateway) {}

  async execute({ user, token }: SendTokenCommand) {
    return this.systemApiGateway.sendTokenAndUpdatedUser(user, token);
  }
}
