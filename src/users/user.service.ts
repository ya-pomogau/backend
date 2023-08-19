import { BadRequestException, ForbiddenException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ObjectId } from 'mongodb';
import { NotFoundException } from '@nestjs/common/exceptions';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import exceptions from '../common/constants/exceptions';
import { AdminPermission, UserRole, UserStatus } from './types';
import { CreateAdminDto } from './dto/create-admin.dto';
import { HashService } from '../hash/hash.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    private readonly hashService: HashService
  ) {}

  async findAll(): Promise<User[]> {
    const users = await this.usersRepository.find();
    return users.map((user) => {
      const { login, password, ...rest } = user;

      return rest;
    });
  }

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    if (createUserDto.role === UserRole.ADMIN || createUserDto.role === UserRole.MASTER) {
      throw new ForbiddenException(exceptions.users.userCreating);
    }

    // const newUser = this.usersRepository.create(createUserDto);
    // return this.usersRepository.save(newUser).catch((e) => {
    //   if (e.code === exceptions.dbCodes.notUnique) {
    //     throw new BadRequestException(exceptions.users.notUniqueVk);
    //   }
    //
    //   return e;
    // });

    // только для тестирования!!! выше вариант в прод
    const hash = await this.hashService.generateHash(createUserDto.password);

    const newUser = await this.usersRepository.create({
      ...createUserDto,
      password: hash,
    });

    const user = await this.usersRepository.save(newUser).catch((e) => {
      if (e.code === exceptions.dbCodes.notUnique) {
        throw new BadRequestException(exceptions.users.notUniqueLogin);
      }

      return e;
    });

    const { login, password, ...rest } = user;

    return rest;
  }

  async createAdmin(createAdminDto: CreateAdminDto): Promise<User> {
    if (createAdminDto.role === UserRole.RECIPIENT || createAdminDto.role === UserRole.VOLUNTEER) {
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
        throw new BadRequestException(exceptions.users.notUniqueLogin);
      }

      return e;
    });

    const { login, password, ...rest } = user;

    return rest;
  }

  async getUserByUsername(fullname: string) {
    const user = await this.usersRepository.findOneBy({ fullname });

    if (!user) {
      throw new NotFoundException(exceptions.users.notFound);
    }

    const { login, password, ...rest } = user;

    return rest;
  }

  async getUserByLogin(login: string) {
    const user = await this.usersRepository.findOne({ where: { login } });

    return user;
  }

  async deleteUserById(id: ObjectId): Promise<void> {
    await this.usersRepository.delete(id);
  }

  async findUserById(id: string): Promise<User | undefined> {
    const _id = new ObjectId(id);
    const user = await this.usersRepository.findOne({
      where: { _id },
    });
    if (!user) {
      throw new NotFoundException(exceptions.users.notFound);
    }
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
      user.role !== UserRole.VOLUNTEER &&
      status !== UserStatus.CONFIRMED &&
      status !== UserStatus.UNCONFIRMED
    ) {
      throw new ForbiddenException(exceptions.users.onlyForVolunteers);
    }

    await this.usersRepository.update({ _id: new ObjectId(id) }, { status });

    return this.findUserById(id);
  }

  async giveKey(id: string) {
    const user = await this.findUserById(id);
    if (user.role !== UserRole.VOLUNTEER) {
      throw new ForbiddenException(exceptions.users.onlyForVolunteers);
    }

    await this.usersRepository.update({ _id: new ObjectId(id) }, { status: UserStatus.ACTIVATED });

    return this.findUserById(id);
  }

  async changeAdminPermissions(id: string, permissions: AdminPermission[]) {
    const user = await this.findUserById(id);

    if (user.role !== UserRole.ADMIN) {
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
}
