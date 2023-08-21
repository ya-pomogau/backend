import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ObjectId } from 'mongodb';
import { NotFoundException } from '@nestjs/common/exceptions';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

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

  async getUserByVkId(vkId: number) {
    return this.usersRepository.findOneBy({ vkId });
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
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async updateOne(id: string, updateUserDto: UpdateUserDto) {
    const _id = new ObjectId(id);
    const user = await this.usersRepository.findOne({
      where: { _id },
    });
    if (!user) {
      throw new Error('User not found');
    }
    return this.usersRepository.save({ ...user, ...updateUserDto });
  }
}
