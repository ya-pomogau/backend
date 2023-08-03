import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { ObjectId } from 'mongodb';
import { NotFoundException } from '@nestjs/common/exceptions';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { instanceToPlain } from 'class-transformer';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  async createUser(userData: CreateUserDto): Promise<User> {
    const newUser = this.usersRepository.create(instanceToPlain(userData));
    return this.usersRepository.save(newUser);
  }

  async getUserByUsername(fullname: string) {
    const user = await this.usersRepository.findOneBy({ fullname });
    return user;
  }

  async deleteUserById(id: ObjectId): Promise<void> {
    await this.usersRepository.delete(id);
  }

  async findUserById(_id: ObjectId): Promise<User | undefined> {
    const user = await this.usersRepository.findOne({
      where: { _id },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async updateOne(_id: ObjectId, updateUserDto: UpdateUserDto) {
    const user = await this.usersRepository.findOne({
      where: { _id },
    });
    if (!user) {
      throw new Error('User not found');
    }
    return await this.usersRepository.save({ ...user, ...updateUserDto });
  }
}
