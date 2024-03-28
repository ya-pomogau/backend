import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersRepositoryModule } from '../../datalake/users/users-repository.module';
import { HashModule } from '../../common/hash/hash.module';
import { HashService } from '../../common/hash/hash.service';

@Module({
  imports: [UsersRepositoryModule, HashModule],
  providers: [UsersService, HashService],
  exports: [UsersService],
})
export class UsersModule {}
