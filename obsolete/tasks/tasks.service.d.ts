import { DataSource, MongoRepository, Repository } from 'typeorm';
import { CreateTaskDto } from './dto/create-task.dto';
import { Task } from './entities/task.entity';
import { User } from '../users/entities/user.entity';
import { Category } from '../categories/entities/category.entity';
import { UpdateTaskDto } from './dto/update-task.dto';
import { GenerateReportDto } from './dto/generate-report.dto';
export declare class TasksService {
    private readonly taskRepository;
    private readonly userRepository;
    private readonly categoryRepository;
    private readonly dataSource;
    constructor(taskRepository: MongoRepository<Task>, userRepository: MongoRepository<User>, categoryRepository: Repository<Category>, dataSource: DataSource);
    create(createTaskDto: CreateTaskDto, ownUser: User): Promise<Task>;
    findAll(): Promise<Task[]>;
    findById(id: string, user: User): Promise<Task>;
    findBy(query: object): Promise<Task[]>;
    findOwn(statuses: string, user: User): Promise<Task[]>;
    acceptTask(taskId: string, user: User): Promise<Task>;
    refuseTask(taskId: string, user: User): Promise<Task>;
    removeTask(taskId: string, user: User): Promise<Task>;
    completeTask(task: Task): Promise<void>;
    closeTask(taskId: string, completed: boolean): Promise<Task>;
    confirmTask(taskId: string, user: User, isTaskCompleted: boolean): Promise<Task>;
    update(id: string, user: User, updateTaskDto: UpdateTaskDto): Promise<Task>;
    generateReport({ status, startDate, endDate, check }: GenerateReportDto): Promise<Task[]>;
}
