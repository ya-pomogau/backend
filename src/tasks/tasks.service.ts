import { ForbiddenException, Injectable } from '@nestjs/common';
import { MongoRepository, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ObjectId } from 'mongodb';
import { NotFoundException } from '@nestjs/common/exceptions';
import { CreateTaskDto } from './dto/create-task.dto';
import { Status, Task } from './entities/task.entity';
import { User, UserRole } from '../users/entities/user.entity';
import exeptions from '../common/constants/exeptions';
import { Category } from '../categories/entities/category.entity';

interface ITaskQuery {
  status: { $in: Status[] };
  'recipient._id'?: ObjectId;
  'volunteer._id'?: ObjectId;
}

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private readonly taskRepository: MongoRepository<Task>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>
  ) {}

  async create(createTaskDto: CreateTaskDto, ownUser: User): Promise<Task> {
    const { recipientId, ...taskInfo } = createTaskDto;
    let recipient;
    if (recipientId) {
      const recipientObjectId = new ObjectId(recipientId);
      recipient = await this.userRepository.findOneBy({ _id: recipientObjectId });
      if (!recipient) {
        throw new NotFoundException(exeptions.users.notFound);
      }
    } else {
      recipient = ownUser;
    }

    const categoryObjectId = new ObjectId(taskInfo.categoryId);
    const category = await this.categoryRepository.findOneBy({ _id: categoryObjectId });

    if (!category) {
      throw new NotFoundException(exeptions.categories.notFound);
    }

    const dto = { ...taskInfo, recipient, points: category.points };

    const newTask = await this.taskRepository.create(dto);
    return this.taskRepository.save(newTask);
  }

  async findAll() {
    return this.taskRepository.find();
  }

  async findById(id: string) {
    const objectId = new ObjectId(id);
    const task = await this.taskRepository.findOneBy({ _id: objectId });

    if (!task) {
      throw new NotFoundException(exeptions.tasks.notFound);
    }

    return task;
  }

  async findByStatus(
    statuses: string,
    recipientId: string | null = null,
    volunteerId: string | null = null
  ) {
    let statusArray: Status[];
    if (!statuses) {
      statusArray = [Status.CREATED, Status.ACCEPTED, Status.CLOSED];
    } else {
      statusArray = statuses.split(',') as Status[];
    }

    const taskQuery: ITaskQuery = { status: { $in: statusArray } };

    if (recipientId) {
      taskQuery['recipient._id'] = new ObjectId(recipientId);
    }

    if (volunteerId) {
      taskQuery['volunteer._id'] = new ObjectId(volunteerId);
    }

    const tasks = await this.taskRepository.find({
      where: taskQuery,
    });

    return tasks;
  }

  async acceptTask(taskId: string, volunteerId: string) {
    const objectTaskId = new ObjectId(taskId);
    const task: Task = await this.taskRepository.findOneBy({ _id: objectTaskId });

    if (!task) {
      throw new NotFoundException(exeptions.tasks.notFound);
    }

    const objectVolunteerId = new ObjectId(volunteerId);
    const volunteer: User = await this.userRepository.findOneBy({ _id: objectVolunteerId });

    if (!volunteer) {
      throw new NotFoundException(exeptions.users.notFound);
    }

    if (volunteer.role !== UserRole.VOLUNTEER) {
      throw new ForbiddenException(exeptions.users.onlyForVolunteers);
    }

    return this.taskRepository.update({ _id: objectTaskId }, { volunteer });
  }

  // update(id: number, updateTaskDto: UpdateTaskDto) {
  //   return `This action updates a #${id} task`;
  // }
  //
  // remove(id: number) {
  //   return `This action removes a #${id} task`;
  // }
}
