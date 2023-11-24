import { Server } from 'socket.io';
import { MongoRepository } from 'typeorm';
import { Task } from '../tasks/entities/task.entity';
import { User } from '../users/entities/user.entity';
import { Category } from '../categories/entities/category.entity';
import { WsMessage } from './types';
export declare class TasksWsGateway {
    private readonly taskRepository;
    private readonly categoryRepository;
    server: Server;
    constructor(taskRepository: MongoRepository<Task>, categoryRepository: MongoRepository<Category>);
    sendMessage(data: WsMessage, accessStatus: any): Promise<void>;
    getInitial(user: User): Promise<Task[]>;
}
