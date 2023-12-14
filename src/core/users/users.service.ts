import { Injectable } from '@nestjs/common';
import { UsersRepository } from '../../datalake/users/users.repository';
import { CreateAdminDto, CreateUserDto } from '../../common/dto/users.dto';
import { UserRole, UserStatus } from '../../common/types/user.types';
import { POJOType } from '../../common/types/pojo.type';
import { Volunteer } from '../../datalake/users/schemas/volunteer.schema';
import { Recipient } from '../../datalake/users/schemas/recipient.schema';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepo: UsersRepository) {}

  private async create(dto: CreateUserDto | CreateAdminDto) {
    return this.usersRepo.create(dto);
  }

  async checkVKCredential(vkId: string): Promise<POJOType<Volunteer | Recipient>> | null {
    return this.usersRepo.findOne({
      vkId,
    });
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
