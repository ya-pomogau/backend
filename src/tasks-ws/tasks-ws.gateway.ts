import { SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OnModuleInit } from '@nestjs/common';
import { Status, Task } from '../tasks/entities/task.entity';

@WebSocketGateway({ cors: { origin: '*' } })
export class TasksWsGateway {
  @WebSocketServer()
  server: Server;

  constructor(
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>
  ) {}

  @SubscribeMessage('findAll')
  async findAll() {
    const tasks = await this.taskRepository.find({ where: { status: Status.CREATED } });
    return tasks;
  }
}
