import { Inject, Injectable } from '@nestjs/common';
import { UsersRepository } from '../../datalake/users/users.repository';

@Injectable()
export class AuthApiService {
  constructor(@Inject() private readonly usersRepo: UsersRepository) {}
}
