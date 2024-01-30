import { Injectable } from '@nestjs/common';
import {
  ForbiddenException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common/exceptions';
import { UsersRepository } from '../../datalake/users/users.repository';
import { CreateAdminDto, CreateUserDto } from '../../common/dto/users.dto';
import { UserRole, UserStatus } from '../../common/types/user.types';
import { HashService } from '../../common/hash/hash.service';
import { Admin } from '../../datalake/users/schemas/admin.schema';
import { POJOType } from '../../common/types/pojo.type';
import { User } from '../../datalake/users/schemas/user.schema';
import { Volunteer } from '../../datalake/users/schemas/volunteer.schema';
import { Recipient } from '../../datalake/users/schemas/recipient.schema';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepo: UsersRepository) {}

  private async create(dto: CreateUserDto | CreateAdminDto): Promise<POJOType<User>> {
    return this.usersRepo.create(dto);
  }

  async checkVKCredential(vkId: string): Promise<POJOType<User>> | null {
    return this.usersRepo.findOne({
      vkId,
      role: { $in: [UserRole.VOLUNTEER, UserRole.RECIPIENT] },
    });
  }

  async checkAdminCredentials(login: string, password: string): Promise<Admin> | null {
    const user = await this.usersRepo.findOne(
      {
        role: UserRole.ADMIN,
        login,
      },
      {
        password: true,
        permissions: true,
        login: true,
        vkId: true,
        profile: true,
        isRoot: true,
        role: true,
      }
    );
    const { password: passDb } = user as Admin;
    const isOk = await HashService.compareHash(password, passDb);
    return isOk ? Promise.resolve(user as Admin) : null;
  }

  async createUser(dto: CreateUserDto) {
    let extras: Partial<CreateUserDto> = {};
    if (dto.role === UserRole.ADMIN) {
      throw new InternalServerErrorException('Internal Server Error', {
        cause: 'createUser() не создаёт администратора',
      });
    }
    if (dto.role === UserRole.VOLUNTEER) {
      extras = { keys: false, score: 0 };
    }
    return this.create({
      status: UserStatus.UNCONFIRMED,
      ...dto,
      ...extras,
    });
  }

  async createAdmin(dto: CreateAdminDto) {
    /*    if (dto.role !== UserRole.ADMIN) {
      throw new InternalServerErrorException('Internal Server Error', {
        cause: 'createAdmin() создаёт только администратора',
      });
    } */
    return this.create({
      ...dto,
      password: await HashService.generateHash(dto.password),
      isRoot: false,
      status: UserStatus.UNCONFIRMED,
      role: UserRole.ADMIN,
    });
  }

  async promote(_id: string) {
    const user = (await this.usersRepo.findById(_id)) as User & (Recipient | Admin | Volunteer);
    if (!user) {
      throw new NotFoundException(`Пользователь с _id '${_id}' не найден<`);
    }
    if (user.role === UserRole.VOLUNTEER || user.role === UserRole.RECIPIENT) {
      const { status } = user as Volunteer | Recipient;
      if (status < UserStatus.ACTIVATED) {
        return this.usersRepo.findByIdAndUpdate(_id, { status: status + 1 }, {});
      }
      return user;
    }
    throw new ForbiddenException('Повысить можно только волонтёра или реципиента');
  }

  async activate(_id: string) {
    const user = (await this.usersRepo.findById(_id)) as User & (Recipient | Admin | Volunteer);
    if (!user) {
      throw new NotFoundException(`Пользователь с _id '${_id}' не найден!`);
    }
    if (user.role === UserRole.ADMIN) {
      return this.usersRepo.findByIdAndUpdate(_id, { isActivated: true }, {});
    }
    throw new ForbiddenException('Можно активировать только администратора');
  }

  async block(_id: string) {
    const user = (await this.usersRepo.findById(_id)) as User & (Recipient | Admin | Volunteer);
    if (!user) {
      throw new NotFoundException(`Пользователь с _id '${_id}' не найден!`);
    }
    if (user.role === UserRole.VOLUNTEER || user.role === UserRole.RECIPIENT) {
      const { status } = user as Volunteer | Recipient;
      if (status > UserStatus.BLOCKED) {
        return this.usersRepo.findByIdAndUpdate(_id, { status: UserStatus.BLOCKED }, {});
      }
      throw new ForbiddenException('Нельзя заблокировать повторно!');
    }
    if (user.role === UserRole.ADMIN) {
      return this.usersRepo.findByIdAndUpdate(_id, { isActivated: false }, {});
    }

    throw new InternalServerErrorException('Внутренняя ошибка сервера', {
      cause: `Некорректный статус пользователя с _id '${_id}' `,
    });
  }
}
