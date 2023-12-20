import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersRepositoryModule } from '../../datalake/users/users-repository.module';

@Module({
  imports: [UsersRepositoryModule],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
