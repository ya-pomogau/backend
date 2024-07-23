import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateUserCommand } from '../common/commands/create-user.command';
import { UsersService } from './users/users.service';
// import { RecipientInterface, VolunteerInterface } from "../common/types/user.types";
import { POJOType } from '../common/types/pojo.type';
import { User } from '../datalake/users/schemas/user.schema';

@CommandHandler(CreateUserCommand)
export class CreateUserHandler implements ICommandHandler<CreateUserCommand> {
  constructor(private readonly usersService: UsersService) {}

  async execute({ dto }: CreateUserCommand): Promise<Promise<POJOType<User>>> {
    return this.usersService.createUser(dto);
  }
}
