import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { HashModule } from '../../common/hash/hash.module';
import { UsersService } from './users.service';
import { UserSchema, User } from './schemas/user.schema';
import { AdminUserSchema } from './schemas/admin.schema';
import { MasterUserSchema } from './schemas/master.schema';
import { RecipientUserSchema } from './schemas/recipient.schema';
import { VisitorUserSchema } from './schemas/visitor.schema';
import { VolunteerUserSchema } from './schemas/volunteer.schema';
import { UserRole } from '../../common/types/user.types';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: User.name,
        schema: UserSchema,
        discriminators: [
          { name: UserRole.ADMIN, schema: AdminUserSchema },
          { name: UserRole.MASTER, schema: MasterUserSchema },
          { name: UserRole.RECIPIENT, schema: RecipientUserSchema },
          { name: UserRole.VISITOR, schema: VisitorUserSchema },
          { name: UserRole.VOLUNTEER, schema: VolunteerUserSchema },
        ],
      },
    ]),
    HashModule,
  ],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
