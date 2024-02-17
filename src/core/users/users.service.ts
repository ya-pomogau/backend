import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { InternalServerErrorException, NotFoundException } from '@nestjs/common/exceptions';
import { UsersRepository } from '../../datalake/users/users.repository';
import { CreateAdminDto, CreateUserDto } from '../../common/dto/users.dto';
import {
  AdminInterface,
  AdminPermission,
  UserProfile,
  UserRole,
  UserStatus,
} from '../../common/types/user.types';
import { HashService } from '../../common/hash/hash.service';
import { Admin } from '../../datalake/users/schemas/admin.schema';
import { POJOType } from '../../common/types/pojo.type';
import { User } from '../../datalake/users/schemas/user.schema';
import { Volunteer } from '../../datalake/users/schemas/volunteer.schema';
import { Recipient } from '../../datalake/users/schemas/recipient.schema';
import { PointGeoJSONInterface } from '../../common/types/point-geojson.types';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepo: UsersRepository) {}

  private async create(dto: {
    address: string;
    role: UserRole;
    isRoot?: boolean;
    keys?: boolean;
    vkId: string;
    avatar?: string;
    login?: string;
    isActive?: boolean;
    score?: number;
    password?: string;
    phone: string;
    permissions?: Array<AdminPermission>;
    name: string;
    location?: PointGeoJSONInterface;
    status?: UserStatus;
  }): Promise<POJOType<User>> {
    return this.usersRepo.create(dto);
  }

  async checkVKCredential(vkId: string): Promise<POJOType<User>> | null {
    return this.usersRepo.findOne({
      vkId,
      role: { $in: [UserRole.VOLUNTEER, UserRole.RECIPIENT] },
    });
  }

  async checkAdminCredentials(login: string, password: string): Promise<AdminInterface> | null {
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
        isRoot: true,
        role: true,
        address: true,
        avatar: true,
        phone: true,
        name: true,
        isActive: true,
      }
    );
    const { password: passDb, ...data } = user as AdminInterface;
    const isOk = await HashService.compareHash(password, passDb);
    return isOk ? Promise.resolve(data as AdminInterface) : null;
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
      isActive: true,
      role: UserRole.ADMIN,
    });
  }

  async confirm(_id: string) {
    const user = (await this.usersRepo.findById(_id)) as User & (Recipient | Admin | Volunteer);
    if (!user) {
      throw new NotFoundException(`Пользователь с _id '${_id}' не найден<`);
    }
    if (user.role === UserRole.VOLUNTEER || user.role === UserRole.RECIPIENT) {
      const { status } = user as Volunteer | Recipient;
      switch (status) {
        case UserStatus.BLOCKED: {
          throw new ForbiddenException(
            `Пользователь с _id '${_id}' заблокирован. Сначала надо снять блокировку.`
          );
        }
        case UserStatus.UNCONFIRMED: {
          return this.usersRepo.findByIdAndUpdate(_id, { status: UserStatus.CONFIRMED }, {});
        }
        case UserStatus.CONFIRMED: {
          return user;
        }
        case UserStatus.ACTIVATED:
        case UserStatus.VERIFIED: {
          throw new ConflictException(
            `Пользователь c _id '${_id}' уже обладает более высоким статусом!`
          );
        }
        default: {
          throw new InternalServerErrorException('Внутренняя ошибка сервера', {
            cause: `Некорректный статус пользователя с _id '${_id}' `,
          });
        }
      }
    }
    throw new BadRequestException('Повысить можно только волонтёра или реципиента');
  }

  async upgrade(_id: string) {
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
    throw new BadRequestException('Повысить можно только волонтёра или реципиента');
  }

  async downgrade(_id: string) {
    const user = (await this.usersRepo.findById(_id)) as User & (Recipient | Admin | Volunteer);
    if (!user) {
      throw new NotFoundException(`Пользователь с _id '${_id}' не найден<`);
    }
    if (user.role === UserRole.VOLUNTEER || user.role === UserRole.RECIPIENT) {
      const { status } = user as Volunteer | Recipient;
      if (status > UserStatus.UNCONFIRMED && status <= UserStatus.ACTIVATED) {
        return this.usersRepo.findByIdAndUpdate(_id, { status: status - 1 }, {});
      }
      return user;
    }
    throw new BadRequestException('Понизить статус можно только волонтёру или реципиенту');
  }

  async grantKeys(_id: string) {
    const user = (await this.usersRepo.findById(_id)) as User & (Recipient | Admin | Volunteer);
    if (!user) {
      throw new NotFoundException(`Пользователь с _id '${_id}' не найден<`);
    }
    if (user.role === UserRole.VOLUNTEER) {
      return this.usersRepo.findByIdAndUpdate(_id, { keys: true }, {});
    }

    throw new BadRequestException('Выдать ключи можно только волонтёру!');
  }

  async revokeKeys(_id: string) {
    const user = (await this.usersRepo.findById(_id)) as User & (Recipient | Admin | Volunteer);
    if (!user) {
      throw new NotFoundException(`Пользователь с _id '${_id}' не найден<`);
    }
    if (user.role === UserRole.VOLUNTEER) {
      return this.usersRepo.findByIdAndUpdate(_id, { keys: false }, {});
    }

    throw new BadRequestException('Отобрать ключи можно только у волонтёра!');
  }

  async activate(_id: string) {
    const user = (await this.usersRepo.findById(_id)) as User & (Recipient | Admin | Volunteer);
    if (!user) {
      throw new NotFoundException(`Пользователь с _id '${_id}' не найден!`);
    }
    if (user.role === UserRole.ADMIN) {
      return this.usersRepo.findOneAndUpdate({ _id, role: UserRole.ADMIN }, { isActive: true }, {});
    }
    throw new BadRequestException('Можно активировать только администратора');
  }

  async block(_id: string) {
    const user = (await this.usersRepo.findById(_id)) as User & (Recipient | Admin | Volunteer);
    if (!user) {
      throw new NotFoundException(`Пользователь с _id '${_id}' не найден!`);
    }
    if (user.role === UserRole.VOLUNTEER || user.role === UserRole.RECIPIENT) {
      return this.usersRepo.findByIdAndUpdate(_id, { status: UserStatus.BLOCKED }, {});
    }
    if (user.role === UserRole.ADMIN) {
      throw new BadRequestException('Нужен _id волонтёра или реципиента!');
    }

    throw new InternalServerErrorException('Внутренняя ошибка сервера', {
      cause: `Некорректная роль пользователя с _id '${_id}' `,
    });
  }

  async deactivate(_id: string) {
    const user = (await this.usersRepo.findById(_id)) as User & (Recipient | Admin | Volunteer);
    if (!user) {
      throw new NotFoundException(`Пользователь с _id '${_id}' не найден!`);
    }
    if (user.role === UserRole.ADMIN) {
      return this.usersRepo.findByIdAndUpdate(_id, { isActivated: false }, {});
    }
    if (user.role === UserRole.VOLUNTEER || user.role === UserRole.RECIPIENT) {
      throw new BadRequestException('Нужен _id администратора!');
    }

    throw new InternalServerErrorException('Внутренняя ошибка сервера', {
      cause: `Некорректная роль пользователя с _id '${_id}' `,
    });
  }

  public async grantPrivileges(userId: string, privileges: Array<AdminPermission>) {
    const user = await this.usersRepo.findById(userId);
    if (!user) {
      throw new NotFoundException('Пользователь не найден!', {
        cause: `Пользователь с _id '${userId}' не найден`,
      });
    }
    if (user.role !== UserRole.ADMIN) {
      throw new BadRequestException('Пользователь должен быть администратором', {
        cause: `Попытка дать права  ${privileges} пользователю с _id '${userId}' и ролью '${user.role}'`,
      });
    }
    return this.usersRepo.findOneAndUpdate(
      { _id: userId, role: UserRole.ADMIN },
      { $addToSet: { permissions: { $each: privileges } } },
      {}
    );
  }

  public async revokePrivileges(userId: string, privileges: Array<AdminPermission>) {
    const user = await this.usersRepo.findById(userId);
    if (!user) {
      throw new NotFoundException('Пользователь не найден!', {
        cause: `Пользователь с _id '${userId}' не найден`,
      });
    }
    if (user.role !== UserRole.ADMIN) {
      throw new BadRequestException('Пользователь должен быть администратором', {
        cause: `Попытка дать права  ${privileges} пользователю с _id '${userId}' и ролью '${user.role}'`,
      });
    }
    return this.usersRepo.findByIdAndUpdate(
      userId,
      { $pull: { permissions: { $in: privileges } } },
      {}
    );
  }

  public async getUsersByRole(role: UserRole) {
    return this.usersRepo.find({
      status: { $ne: UserStatus.UNCONFIRMED },
      role,
    });
  }

  public async getUnconfirmedUsers() {
    return this.usersRepo.find({
      status: UserStatus.UNCONFIRMED,
    });
  }

  public async getAdministrators() {
    return this.usersRepo.find({ role: UserRole.ADMIN, isActive: true });
  }

  public async getProfile(userId: string) {
    return this.usersRepo.findById(userId);
  }

  public async updateProfile(userId: string, dto: Partial<UserProfile>) {
    console.dir(dto);
    return this.usersRepo.findByIdAndUpdate(userId, dto, { new: true });
  }
}
