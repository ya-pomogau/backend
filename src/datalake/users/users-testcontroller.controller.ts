import { Body, Controller, Post } from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { CreateAdminDto, CreateUserDto } from '../../common/dto/users.dto';
import { UserRole, UserStatus } from '../../common/types/user.types';

@Controller('users')
export class UsersTestcontrollerController {
  constructor(private readonly usersRepo: UsersRepository) {}

  @Post('create')
  async create(@Body() dto: CreateUserDto | CreateAdminDto) {
    // eslint-disable-next-line no-console
    console.log('dto:');
    // eslint-disable-next-line no-console
    console.dir(dto);
    let extras: Partial<CreateUserDto | CreateAdminDto> = {};
    if (dto.role === UserRole.VOLUNTEER) {
      extras = { keys: false, score: 0 };
    }
    const doc = await this.usersRepo.create({
      status: UserStatus.UNCONFIRMED,
      ...dto,
      ...extras,
    });
    // eslint-disable-next-line no-console
    console.log('doc');
    // eslint-disable-next-line no-console
    console.dir(doc);
    return doc;
  }
}
