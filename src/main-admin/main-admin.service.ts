import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MainAdmin } from './main-admin.entity';
import * as bcrypt from 'bcrypt';
@Injectable()
export class MainAdminService {
  constructor(
    @InjectRepository(MainAdmin) 
    private mainAdminRepository: Repository<MainAdmin>,
    private readonly mainAdminService: MainAdminService,
    ) {}

  async findByUsername(username: string): Promise<MainAdmin | undefined> {
    return this.mainAdminRepository.findOne({ where: { username } });
  }
  async validatePassword(
    password: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }

  async findById(id: number): Promise<MainAdmin | undefined> {
    return this.mainAdminRepository.findOne({ where: { id } });
  }
}