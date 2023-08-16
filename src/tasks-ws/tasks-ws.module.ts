import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TasksWsGateway } from './tasks-ws.gateway';
import { Task } from '../tasks/entities/task.entity';
import { Category } from '../categories/entities/category.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Task, Category])],
  providers: [TasksWsGateway],
  exports: [TasksWsGateway],
})
export class TasksWsModule {}
