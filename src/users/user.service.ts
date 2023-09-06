import { BadRequestException, ForbiddenException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository } from 'typeorm';
import { ObjectId } from 'mongodb';
import { NotFoundException } from '@nestjs/common/exceptions';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import exceptions from '../common/constants/exceptions';

import { AdminPermission, EUserRole, ReportStatus, UserStatus } from './types';

import { CreateAdminDto } from './dto/create-admin.dto';
import { HashService } from '../hash/hash.service';
import { GenerateReportDto } from './dto/generate-report.dto';
import { daysOfActivityMS } from '../common/constants';
import checkValidId from '../common/helpers/checkValidId';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: MongoRepository<User>,
    private readonly hashService: HashService
  ) {}

  async findAll(): Promise<Omit<User, 'login' | 'password'>[]> {
    const users = await this.usersRepository.find();
    return users.map((user) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars

      const { login, password, ...rest } = user;

      return rest;
    });
  }

  async findBy(query: object): Promise<User[]> {
    const taskQuery: object = {};

    for (const property in query) {
      taskQuery[property] = { $in: query[property].split(',') };
    }

    const tasks = await this.usersRepository.find({
      where: taskQuery,
    });

    return tasks;
  }

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    if (createUserDto.role === EUserRole.ADMIN || createUserDto.role === EUserRole.MASTER) {
      throw new ForbiddenException(exceptions.users.userCreating);
    }

    const newUser = this.usersRepository.create(createUserDto);
    return this.usersRepository.save(newUser).catch((e) => {
      console.log(e);
      if (e.code === exceptions.dbCodes.notUnique) {
        throw new BadRequestException(exceptions.users.notUniqueVk);
      }

      return e;
    });
  }

  async createAdmin(createAdminDto: CreateAdminDto): Promise<User> {
    if (
      createAdminDto.role === EUserRole.RECIPIENT ||
      createAdminDto.role === EUserRole.VOLUNTEER
    ) {
      throw new ForbiddenException(exceptions.users.adminCreating);
    }

    const hash = await this.hashService.generateHash(createAdminDto.password);

    const newUser = await this.usersRepository.create({
      ...createAdminDto,
      password: hash,
      status: UserStatus.ACTIVATED,
    });

    const user = await this.usersRepository.save(newUser).catch((e) => {
      if (e.code === exceptions.dbCodes.notUnique) {
        console.log(e);

        throw new BadRequestException(exceptions.users.notUniqueLogin);
      }

      return e;
    });

    // eslint-disable-next-line @typescript-eslint/no-unused-vars

    const { login, password, ...rest } = user;

    return rest;
  }

  async getUserByUsername(fullname: string) {
    const user = await this.usersRepository.findOneBy({ fullname });

    if (!user) {
      throw new NotFoundException(exceptions.users.notFound);
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars

    const { login, password, ...rest } = user;

    return rest;
  }

  async getUserByLogin(login: string) {
    const user = await this.usersRepository.findOne({ where: { login } });

    return user;
  }

  async getUserByVkId(vkId: number) {
    const user = await this.usersRepository.findOneBy({ vkId });

    if (!user) {
      throw new NotFoundException(exceptions.users.notFound);
    }

    return user;
  }

  async deleteUserById(id: string): Promise<void> {
    checkValidId(id);
    const objectId = new ObjectId(id);
    await this.usersRepository.delete(objectId);
  }

  async findUserById(id: string): Promise<Omit<User, 'login'> | undefined> {
    checkValidId(id);
    const _id = new ObjectId(id);
    const user = await this.usersRepository.findOne({
      where: { _id },
    });
    if (!user) {
      throw new NotFoundException(exceptions.users.notFound);
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars

    const { login, password, ...rest } = user;

    return rest;
  }

  async updateOne(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.findUserById(id);
    return this.usersRepository.save({ ...user, ...updateUserDto });
  }

  async changeStatus(id: string, status: UserStatus) {
    const user = await this.findUserById(id);
    if (
      user.role !== EUserRole.VOLUNTEER &&
      status !== UserStatus.CONFIRMED &&
      status !== UserStatus.UNCONFIRMED
    ) {
      throw new ForbiddenException(exceptions.users.onlyForVolunteers);
    }

    if (status > 2) {
      throw new BadRequestException(exceptions.users.notForKeys);
    }

    await this.usersRepository.update({ _id: new ObjectId(id) }, { status });

    return this.findUserById(id);
  }

  async giveKey(id: string) {
    const user = await this.findUserById(id);

    if (user.role !== EUserRole.VOLUNTEER) {
      throw new ForbiddenException(exceptions.users.onlyForVolunteers);
    }

    await this.usersRepository.update({ _id: new ObjectId(id) }, { status: UserStatus.ACTIVATED });

    return this.findUserById(id);
  }

  async changeAdminPermissions(id: string, permissions: AdminPermission[]) {
    const user = await this.findUserById(id);

    if (user.role !== EUserRole.ADMIN) {
      throw new ForbiddenException(exceptions.users.onlyForAdmins);
    }

    await this.usersRepository.update({ _id: new ObjectId(id) }, { permissions });

    return this.findUserById(id);
  }

  async blockUser(id: string) {
    const user = await this.findUserById(id);

    await this.usersRepository.update({ _id: new ObjectId(id) }, { isBlocked: !user.isBlocked });

    return this.findUserById(id);
  }

  async generateReport({ reportStatus, reportRole }: GenerateReportDto) {
    const activityDate = new Date().getTime() - daysOfActivityMS;
    if (reportStatus === ReportStatus.NEW) {
      return this.usersRepository.find({
        where: {
          status: UserStatus.CONFIRMED,
          lastActivityDate: null,
          role: reportRole,
        },
      });
    }
    if (reportStatus === ReportStatus.ACTIVE) {
      return this.usersRepository.find({
        where: {
          lastActivityDate: {
            $gte: new Date(activityDate),
          },
          role: reportRole,
        },
      });
    }
    if (reportStatus === ReportStatus.INACTIVE) {
      return this.usersRepository.find({
        where: {
          lastActivityDate: {
            $lt: new Date(activityDate),
          },
          role: reportRole,
        },
      });
    }
    if (reportStatus === ReportStatus.BLOCKED) {
      return this.usersRepository.find({
        where: {
          isBlocked: true,
          role: reportRole,
        },
      });
    }

    return [];
  }
}
