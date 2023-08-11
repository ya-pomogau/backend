import { ForbiddenException, Injectable } from '@nestjs/common';
import { DataSource, MongoRepository, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ObjectId } from 'mongodb';
import { NotFoundException } from '@nestjs/common/exceptions';
import { CreateTaskDto } from './dto/create-task.dto';
import { Status, Task } from './entities/task.entity';
import { User } from '../users/entities/user.entity';
import exceptions from '../common/constants/exceptions';
import { Category } from '../categories/entities/category.entity';
import timeDifference from '../common/utils/timeDifference';
import { dayInMs } from '../common/constants';
import queryRunner from '../common/helpers/queryRunner';
import { UpdateTaskDto } from './dto/update-task.dto';

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
    private readonly categoryRepository: Repository<Category>,
    private readonly dataSource: DataSource
  ) {}

  async create(createTaskDto: CreateTaskDto, ownUser: any): Promise<Task> {
    const { recipientId, ...taskInfo } = createTaskDto;

    if (timeDifference(new Date(), taskInfo.completionDate) <= 0) {
      throw new ForbiddenException(exceptions.tasks.wrongCompletionDate);
    }

    let recipient;
    if (recipientId) {
      const recipientObjectId = new ObjectId(recipientId);
      recipient = await this.userRepository.findOneBy({ _id: recipientObjectId });
      if (!recipient) {
        throw new NotFoundException(exceptions.users.notFound);
      }
    } else {
      recipient = ownUser;
    }

    if (recipient.role !== 'recipient') {
      throw new ForbiddenException(exceptions.users.onlyForRecipients);
    }

    const categoryObjectId = new ObjectId(taskInfo.categoryId);
    const category = await this.categoryRepository.findOneBy({ _id: categoryObjectId });

    if (!category) {
      throw new NotFoundException(exceptions.categories.notFound);
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
      throw new NotFoundException(exceptions.tasks.notFound);
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

  // добавить принятие заявки из авторизованного пользователя
  async acceptTask(taskId: string, volunteerId: string) {
    const objectTaskId = new ObjectId(taskId);
    const task: Task = await this.taskRepository.findOneBy({ _id: objectTaskId });

    if (!task) {
      throw new NotFoundException(exceptions.tasks.notFound);
    }

    if (task.status !== Status.CREATED) {
      throw new ForbiddenException(exceptions.tasks.onlyForCreated);
    }

    const objectVolunteerId = new ObjectId(volunteerId);
    const volunteer: User = await this.userRepository.findOneBy({ _id: objectVolunteerId });

    if (!volunteer) {
      throw new NotFoundException(exceptions.users.notFound);
    }

    if (volunteer.role !== 'volunteer') {
      throw new ForbiddenException(exceptions.users.onlyForVolunteers);
    }

    return this.taskRepository.update(
      { _id: objectTaskId },
      {
        volunteer,
        status: Status.ACCEPTED,
      }
    );
  }

  // добавить проверку на пользователя, когда будет аутентификация
  async refuseTask(taskId: string, isAdmin: boolean) {
    const objectTaskId = new ObjectId(taskId);
    const task: Task = await this.taskRepository.findOneBy({ _id: objectTaskId });

    if (!task) {
      throw new NotFoundException(exceptions.tasks.notFound);
    }

    if (timeDifference(new Date(), task.completionDate) < dayInMs && !isAdmin) {
      throw new ForbiddenException(exceptions.tasks.noTimeForRefusal);
    }

    return this.taskRepository.update(
      { _id: objectTaskId },
      { volunteer: null, status: Status.CREATED }
    );
  }

  async removeTask(taskId: string, isAdmin: boolean) {
    const objectTaskId = new ObjectId(taskId);
    const task: Task = await this.taskRepository.findOneBy({ _id: objectTaskId });

    if (!task) {
      throw new NotFoundException(exceptions.tasks.notFound);
    }

    if (task.volunteer && !isAdmin) {
      throw new ForbiddenException(exceptions.tasks.cancelForbidden);
    }

    return this.taskRepository.delete(objectTaskId);
  }

  async completeTask(task: Task) {
    if (task.status !== Status.ACCEPTED) {
      throw new ForbiddenException(exceptions.tasks.onlyForAccepted);
    }

    const objectVolunteerId = new ObjectId(task.volunteer._id);
    const volunteer: User = await this.userRepository.findOneBy({ _id: objectVolunteerId });

    if (!volunteer) {
      throw new NotFoundException(exceptions.users.notFound);
    }

    await queryRunner(this.dataSource, [
      this.taskRepository.update(
        { _id: new ObjectId(task._id) },
        { status: Status.CLOSED, completed: true }
      ),
      this.userRepository.update(
        { _id: objectVolunteerId },
        { scores: volunteer.scores + task.points }
      ),
    ]);
  }

  async closeTask(taskId: string, completed: boolean) {
    const objectTaskId = new ObjectId(taskId);
    const task: Task = await this.taskRepository.findOneBy({ _id: objectTaskId });

    if (!task) {
      throw new NotFoundException(exceptions.tasks.notFound);
    }

    if (completed) {
      await this.completeTask(task);
    } else {
      await this.taskRepository.update(
        { _id: objectTaskId },
        { status: Status.CLOSED, completed: false }
      );
    }

    return this.taskRepository.findOneBy({ _id: objectTaskId });
  }

  async confirmTask(taskId: string, userId: string, isTaskCompleted: boolean) {
    const objectTaskId = new ObjectId(taskId);
    const task: Task = await this.taskRepository.findOneBy({ _id: objectTaskId });

    if (!task) {
      throw new NotFoundException(exceptions.tasks.notFound);
    }

    if (task.status !== Status.ACCEPTED) {
      throw new ForbiddenException(exceptions.tasks.onlyForAccepted);
    }

    if (task.recipient._id.toString() === userId) {
      await this.taskRepository.update(
        { _id: objectTaskId },
        { confirmation: { ...task.confirmation, recipient: isTaskCompleted } }
      );
    } else if (task.volunteer._id.toString() === userId) {
      await this.taskRepository.update(
        { _id: objectTaskId },
        { confirmation: { ...task.confirmation, volunteer: isTaskCompleted } }
      );
    } else {
      throw new ForbiddenException(exceptions.tasks.wrongUser);
    }

    if (task.confirmation.recipient !== null && task.confirmation.volunteer !== null) {
      if (task.confirmation.recipient === true && task.confirmation.volunteer === true) {
        await this.completeTask(task);
      } else if (task.confirmation.recipient === false && task.confirmation.volunteer === false) {
        await this.taskRepository.update(
          { _id: objectTaskId },
          { status: Status.CLOSED, completed: false }
        );
      } else {
        console.log('Вызывайте админа!!!');
      }
    }

    return this.taskRepository.findOneBy({ _id: objectTaskId });
  }

  // разрешить редактирование только создателю заявки или админу
  async update(id: string, updateTaskDto: UpdateTaskDto) {
    const objectTaskId = new ObjectId(id);
    const task: Task = await this.taskRepository.findOneBy({ _id: objectTaskId });

    if (!task) {
      throw new NotFoundException(exceptions.tasks.notFound);
    }

    if (task.status !== Status.CREATED) {
      throw new ForbiddenException(exceptions.tasks.onlyForCreated);
    }

    await this.taskRepository.update({ _id: objectTaskId }, updateTaskDto);

    return this.taskRepository.findOneBy({ _id: objectTaskId });
  }
}
