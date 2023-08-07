import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MainAdmin } from './main-admin.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class MainAdminService {
  constructor(
    @InjectRepository(MainAdmin)
    private readonly mainAdminRepository: Repository<MainAdmin>,
  ) {}

  async findOneByUsername(username: string): Promise<MainAdmin> {
    return this.mainAdminRepository.findOne({ where: { username } });
  }

  async findByUsername(username: string): Promise<MainAdmin | undefined> {
    return this.mainAdminRepository.findOne({ where: { username } });
  }

  async findOneById(id: number): Promise<MainAdmin> {
    return this.mainAdminRepository.findOne({ where: { id } });
  }

  async validatePassword(
    password: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }
}
