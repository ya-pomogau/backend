import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ObjectId } from 'mongodb';
import { NotFoundException } from '@nestjs/common/exceptions';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import exceptions from '../common/constants/exceptions';
import { AdminPermission, UserRole, UserStatus } from './types';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>
  ) {}

  async findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  async createUser(userData: CreateUserDto): Promise<User> {
    const newUser = this.usersRepository.create(userData);
    return this.usersRepository.save(newUser);
  }

  async getUserByUsername(fullname: string) {
    const user = await this.usersRepository.findOneBy({ fullname });
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
    return user;
  }

  async updateOne(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.findUserById(id);
    return this.usersRepository.save({ ...user, ...updateUserDto });
  }

  async changeStatus(id: string, status: UserStatus) {
    const user = await this.findUserById(id);
    if (
      user.role === UserRole.RECIPIENT &&
      status !== UserStatus.CONFIRMED &&
      status !== UserStatus.UNCONFIRMED
    ) {
      throw new ForbiddenException(exceptions.users.onlyForVolunteers);
    }

    await this.usersRepository.update({ _id: new ObjectId(id) }, { status });

    return this.findUserById(id);
  }

  async changeAdminPermissions(id: string, permissions: AdminPermission[]) {
    const user = await this.findUserById(id);

    if (user.role !== UserRole.ADMIN) {
      return new ForbiddenException(exceptions.users.onlyForAdmins);
    }

    await this.usersRepository.update({ _id: new ObjectId(id) }, { permissions });

    return this.findUserById(id);
  }
}
