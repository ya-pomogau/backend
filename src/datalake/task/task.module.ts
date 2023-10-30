import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TaskService } from './task.service';
import { Task, TaskSchema } from './schemas/task.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: Task.name, schema: TaskSchema }])],
  providers: [TaskService],
})
export class TaskModule {}
