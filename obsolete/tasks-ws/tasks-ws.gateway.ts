import { SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository } from 'typeorm';
import { Task } from '../tasks/entities/task.entity';
import { TaskStatus } from '../tasks/types';
import { AuthUser } from '../auth/decorators/auth-user.decorator';
import { User } from '../users/entities/user.entity';
import { Category } from '../categories/entities/category.entity';
import { WsMessage } from './types';

@WebSocketGateway({ cors: { origin: '*' } })
export class TasksWsGateway {
  @WebSocketServer()
  server: Server;

  constructor(
    @InjectRepository(Task)
    private readonly taskRepository: MongoRepository<Task>,
    @InjectRepository(Category)
    private readonly categoryRepository: MongoRepository<Category>
  ) {}

  @SubscribeMessage('getMessage')
  async sendMessage(data: WsMessage, accessStatus): Promise<void> {
    this.server.emit(`getMessage-access-${accessStatus}`, data);
  }

  @SubscribeMessage('getInitial')
  async getInitial(@AuthUser() user: User) {
    const accessStatus = user ? user.status : 1;

    const tasks = await this.taskRepository.find({
      where: { status: TaskStatus.CREATED, accessStatus },
    });
    return tasks;
  }
}
