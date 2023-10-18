import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { HashModule } from '../../hash/hash.module';
import { UsersService } from './users.service';
import { UserSchema, User } from './schemas/user.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]), HashModule],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
