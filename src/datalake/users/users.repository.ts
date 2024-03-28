/* eslint-disable @typescript-eslint/ban-types */
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './schemas/user.schema';

import { BaseRepositoryService } from '../base-repository/base-repository.service';
import { UserModelVirtuals } from '../../common/types/user.types';

@Injectable()
export class UsersRepository extends BaseRepositoryService<User, {}, UserModelVirtuals> {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<User, {}, {}, UserModelVirtuals>
  ) {
    super(userModel);
  }

  /* async checkAdminCredentials(login: string, password: string): Promise<POJOType<Admin>> | null {
    const user = await this.findOne(
      {
        role: UserRole.ADMIN,
        login,
      },
      { password: true }
    );
    const isOk = HashService.compareHash(password, user.password);
    return isOk ? user : null;
  } */
}
