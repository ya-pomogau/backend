import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TasksWsGateway } from './tasks-ws.gateway';
import { Task } from '../tasks/entities/task.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Task])],
  providers: [TasksWsGateway],
  exports: [TasksWsGateway],
})
export class TasksWsModule {}
