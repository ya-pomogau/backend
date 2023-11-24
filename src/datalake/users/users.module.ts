import { Module } from '@nestjs/common';
import { ModelDefinition, MongooseModule } from '@nestjs/mongoose';
import { UsersRepository } from './users.repository';
import { UserSchema, User } from './schemas/user.schema';
import { AdminUserSchema, Admin } from './schemas/admin.schema';
import { Recipient, RecipientUserSchema } from './schemas/recipient.schema';
import { Volunteer, VolunteerUserSchema } from './schemas/volunteer.schema';
import { UsersTestcontrollerController } from './users-testcontroller.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: User.name,
        schema: UserSchema,
        discriminators: [
          { name: Admin.name, schema: AdminUserSchema },
          { name: Recipient.name, schema: RecipientUserSchema },
          { name: Volunteer.name, schema: VolunteerUserSchema },
        ],
      } as ModelDefinition,
    ]),
  ],
  providers: [UsersRepository],
  exports: [UsersRepository],
  controllers: [UsersTestcontrollerController],
})
export class UsersModule {}
