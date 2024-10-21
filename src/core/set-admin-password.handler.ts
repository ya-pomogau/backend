import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { SetAdminPasswordCommand } from '../common/commands/set-admin-password.command';
import { UsersService } from './users/users.service';

@CommandHandler(SetAdminPasswordCommand)
export class SetAdminPassordHandler implements ICommandHandler<SetAdminPasswordCommand> {
  constructor(private readonly userService: UsersService) {}

  async execute({ userId, password }: SetAdminPasswordCommand) {
    await this.userService.setAdminPassword(userId, password);
  }
}
