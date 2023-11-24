import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { User } from '../users/entities/user.entity';
import { TasksWsGateway } from '../tasks-ws/tasks-ws.gateway';
import { ConfirmTaskDto } from './dto/confirm-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Task } from './entities/task.entity';
import { GenerateReportDto } from './dto/generate-report.dto';
export declare class TasksController {
    private readonly tasksService;
    private readonly tasksGateway;
    constructor(tasksService: TasksService, tasksGateway: TasksWsGateway);
    create(createTaskDto: CreateTaskDto, user: User): Promise<Task>;
    findBy(query: object): Promise<Task[]>;
    findOwn(status: string, user: User): Promise<Task[]>;
    generateReport(generateReportDto: GenerateReportDto): Promise<Task[]>;
    findAll(): Promise<Task[]>;
    findById(id: string, user: User): Promise<Task>;
    acceptTask(taskId: string, user: User): Promise<Task>;
    refuseTask(id: string, user: User): Promise<Task>;
    deleteTask(id: string, user: User): Promise<Task>;
    closeTask(id: string, completed: boolean): Promise<Task>;
    confirmTask(id: string, confirmTaskDto: ConfirmTaskDto, user: User): Promise<Task>;
    update(id: string, updateTaskDto: UpdateTaskDto, user: User): Promise<Task>;
}
