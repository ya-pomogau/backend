import { Inject, Injectable } from '@nestjs/common';
import { UsersRepository } from '../../datalake/users/users.repository';
import { CreateAdminDto, CreateUserDto } from '../../common/dto/users.dto';
import { UserRole, UserStatus } from '../../common/types/user.types';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepo: UsersRepository) {}

  private async create(dto: CreateUserDto | CreateAdminDto) {
    return this.usersRepo.create(dto);
  }

  async createUser(dto: CreateUserDto) {
    let extras: Partial<CreateUserDto | CreateAdminDto> = {};
    if (dto.role === UserRole.VOLUNTEER) {
      extras = { keys: false, score: 0 };
    }
    return this.create({
      status: UserStatus.UNCONFIRMED,
      ...dto,
      ...extras,
    } as CreateUserDto);
  }

  async createAdmin(dto: CreateAdminDto) {
    return this.create({ ...dto, isRoot: false, role: UserRole.ADMIN });
  }
}
