import { Module } from '@nestjs/common';
import { RecipientApiController } from './recipient-api.controller';
import { TasksModule } from '../../core/tasks/tasks.module';
import { TasksService } from '../../core/tasks/tasks.service';

@Module({
  imports: [TasksModule],
  controllers: [RecipientApiController],
  providers: [TasksService],
})
export class RecipientApiModule {}
