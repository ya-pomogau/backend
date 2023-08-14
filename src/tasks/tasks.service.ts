import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ObjectId } from 'mongodb';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Task } from './entities/task.entity';
import { UserService } from '../users/user.service';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,
    private userService: UserService
  ) {}

  async create(createTaskDto: CreateTaskDto): Promise<Task> {
    const { id } = createTaskDto;
    const user = await this.userService.findUserById(id);
    const newTask = new Task();
    newTask.title = createTaskDto.title;
    newTask.description = createTaskDto.description;
    newTask.date = createTaskDto.date;
    newTask.address = createTaskDto.address;
    newTask.owner = user; // Устанавливаем связь с пользователем
    const savedTask = await this.taskRepository.save(newTask);
    return savedTask;
  }

  findAll() {
    return `This action returns all tasks`;
  }

  findOne(id: number) {
    return `This action returns a #${id} task`;
  }

  update(id: number, updateTaskDto: UpdateTaskDto) {
    return `This action updates a #${id} task`;
  }

  remove(id: number) {
    return `This action removes a #${id} task`;
  }
}
