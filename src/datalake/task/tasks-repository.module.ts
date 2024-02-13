import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TasksRepository } from './task.repository';
import { Task, TaskSchema } from './schemas/task.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: Task.name, schema: TaskSchema }])],
  providers: [TasksRepository],
  exports: [TasksRepository],
})
export class TasksRepositoryModule {}
