import { Injectable } from '@nestjs/common';
import { UsersRepository } from '../../datalake/users/users.repository';
import { CreateAdminDto, CreateUserDto } from '../../common/dto/users.dto';
import {
  AdminUserInterface,
  UserInterface,
  UserRole,
  UserStatus,
} from '../../common/types/user.types';
import { POJOType } from '../../common/types/pojo.type';
import { Volunteer } from '../../datalake/users/schemas/volunteer.schema';
import { Recipient } from '../../datalake/users/schemas/recipient.schema';
import { HashService } from '../../common/hash/hash.service';
import { Admin } from '../../datalake/users/schemas/admin.schema';
import { MongooseIdAndTimestampsInterface } from '../../common/types/system.types';

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

  async checkAdminCredentials(login: string, password: string): Promise<POJOType<Admin>> | null {
    const user = (await this.usersRepo.findOne(
      {
        role: UserRole.ADMIN,
        login,
      },
      { password: true }
    )) as unknown as UserInterface & AdminUserInterface & MongooseIdAndTimestampsInterface;
    const isOk = HashService.compareHash(password, user.password);
    return isOk ? user : null;
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
