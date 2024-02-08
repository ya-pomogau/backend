import { Module } from '@nestjs/common';
import { VolunteerApiController } from './volunteer-api.controller';
import { TasksModule } from '../../core/tasks/tasks.module';
import { TasksService } from '../../core/tasks/tasks.service';

@Module({
  imports: [TasksModule],
  controllers: [VolunteerApiController],
  providers: [TasksService],
})
export class VolunteerApiModule {}
