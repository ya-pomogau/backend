import { ForbiddenException, Injectable } from '@nestjs/common';
import { DataSource, MongoRepository, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ObjectId } from 'mongodb';
import { NotFoundException } from '@nestjs/common/exceptions';
import { CreateTaskDto } from './dto/create-task.dto';
import { Task } from './entities/task.entity';
import { User } from '../users/entities/user.entity';
import exceptions from '../common/constants/exceptions';
import { Category } from '../categories/entities/category.entity';
import timeDifference from '../common/utils/timeDifference';
import { UserRole, UserStatus } from '../users/types';
import { TaskStatus } from './types';
import { dayInMs } from '../common/constants';
import queryRunner from '../common/helpers/queryRunner';
import { UpdateTaskDto } from './dto/update-task.dto';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private readonly taskRepository: MongoRepository<Task>,
    @InjectRepository(User)
    private readonly userRepository: MongoRepository<User>,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    private readonly dataSource: DataSource
  ) {}

  async create(createTaskDto: CreateTaskDto, ownUser: User): Promise<Task> {
    const { recipientId, ...taskInfo } = createTaskDto;

    if (timeDifference(new Date(), taskInfo.completionDate) <= 0) {
      throw new ForbiddenException(exceptions.tasks.wrongCompletionDate);
    }

    let recipient: User;
    if (ownUser.role === UserRole.RECIPIENT) {
      recipient = ownUser;
    } else {
      const recipientObjectId = new ObjectId(recipientId);
      recipient = await this.userRepository.findOneBy({ _id: recipientObjectId });
      if (!recipient) {
        throw new NotFoundException(exceptions.users.notFound);
      }
    }

    if (recipient.role !== 'recipient') {
      throw new ForbiddenException(exceptions.users.onlyForRecipients);
    }

    if (recipient.status < UserStatus.CONFIRMED) {
      throw new ForbiddenException(exceptions.tasks.wrongStatus);
    }

    const category = await this.categoryRepository.findOneBy({
      _id: new ObjectId(taskInfo.categoryId),
    });

    if (!category) {
      throw new NotFoundException(exceptions.categories.notFound);
    }

    const dto = {
      ...taskInfo,
      recipientId: recipient._id.toString(),
      points: category.points,
      accessStatus: category.accessStatus,
    };

    const newTask = await this.taskRepository.create(dto);

    return this.taskRepository.save(newTask);
  }

  async findAll() {
    return this.taskRepository.find();
  }

  async findById(id: string, user: User) {
    const objectId = new ObjectId(id);
    const task = await this.taskRepository.findOneBy({ _id: objectId });

    if (!task) {
      throw new NotFoundException(exceptions.tasks.notFound);
    }

    if (
      (user.role === UserRole.RECIPIENT && task.recipientId !== user._id.toString()) ||
      (user.role === UserRole.VOLUNTEER &&
        task.volunteerId !== user._id.toString() &&
        task.status !== TaskStatus.CREATED)
    ) {
      throw new ForbiddenException(exceptions.tasks.wrongUser);
    }

    return task;
  }

  async findBy(query: object) {
    const taskQuery: object = {};

    for (const property in query) {
      taskQuery[property] = { $in: query[property].split(',') };
    }

    const tasks = await this.taskRepository.find({
      where: taskQuery,
    });

    return tasks;
  }

  async findOwn(statuses: string, user: User) {
    const statusArray = statuses
      ? statuses.split(',')
      : [TaskStatus.CREATED, TaskStatus.ACCEPTED, TaskStatus.CLOSED];

    if (user.role === UserRole.RECIPIENT) {
      return this.taskRepository.find({
        where: { status: { $in: statusArray }, recipientId: user._id.toString() },
      });
    }
    return this.taskRepository.find({
      where: { status: { $in: statusArray }, volunteerId: user._id.toString() },
    });
  }

  async acceptTask(taskId: string, user: User) {
    const objectTaskId = new ObjectId(taskId);
    const task: Task = await this.taskRepository.findOneBy({ _id: objectTaskId });

    if (!task) {
      throw new NotFoundException(exceptions.tasks.notFound);
    }

    if (task.status !== TaskStatus.CREATED) {
      throw new ForbiddenException(exceptions.tasks.onlyForCreated);
    }

    if (user.role !== UserRole.VOLUNTEER) {
      throw new ForbiddenException(exceptions.users.onlyForVolunteers);
    }

    const category = await this.categoryRepository.findOneBy({
      _id: new ObjectId(task.categoryId),
    });

    if (user.status < category.accessStatus) {
      throw new ForbiddenException(exceptions.tasks.wrongStatus);
    }

    await this.taskRepository.update(
      { _id: objectTaskId },
      {
        volunteerId: user._id.toString(),
        status: TaskStatus.ACCEPTED,
      }
    );

    return this.taskRepository.findOneBy({ _id: objectTaskId });
  }

  async refuseTask(taskId: string, user: User) {
    const objectTaskId = new ObjectId(taskId);
    const task: Task = await this.taskRepository.findOneBy({ _id: objectTaskId });

    if (!task) {
      throw new NotFoundException(exceptions.tasks.notFound);
    }

    if (
      timeDifference(new Date(), task.completionDate) < dayInMs &&
      user.role === UserRole.VOLUNTEER
    ) {
      throw new ForbiddenException(exceptions.tasks.noTimeForRefusal);
    }

    if (task.volunteerId !== user._id.toString() && user.role === UserRole.VOLUNTEER) {
      throw new ForbiddenException(exceptions.tasks.wrongUser);
    }

    await this.taskRepository.update(
      { _id: objectTaskId },
      { volunteerId: null, status: TaskStatus.CREATED }
    );

    return this.taskRepository.findOneBy({ _id: objectTaskId });
  }

  async removeTask(taskId: string, user: User) {
    const objectTaskId = new ObjectId(taskId);
    const task: Task = await this.taskRepository.findOneBy({ _id: objectTaskId });

    if (!task) {
      throw new NotFoundException(exceptions.tasks.notFound);
    }

    if (task.recipientId !== user._id.toString() && user.role === UserRole.RECIPIENT) {
      throw new ForbiddenException(exceptions.tasks.wrongUser);
    }

    if (task.volunteerId && user.role === UserRole.RECIPIENT) {
      throw new ForbiddenException(exceptions.tasks.cancelForbidden);
    }

    await this.taskRepository.delete(objectTaskId);

    return task;
  }

  async completeTask(task: Task) {
    if (task.status !== TaskStatus.ACCEPTED) {
      throw new ForbiddenException(exceptions.tasks.onlyForAccepted);
    }

    const objectVolunteerId = new ObjectId(task.volunteerId);
    const volunteer: User = await this.userRepository.findOneBy({ _id: objectVolunteerId });

    if (!volunteer) {
      throw new NotFoundException(exceptions.users.notFound);
    }

    await queryRunner(this.dataSource, [
      this.taskRepository.update(
        { _id: new ObjectId(task._id) },
        { status: TaskStatus.CLOSED, completed: true }
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
        { status: TaskStatus.CLOSED, completed: false }
      );
    }

    return this.taskRepository.findOneBy({ _id: objectTaskId });
  }

  async confirmTask(taskId: string, user: User, isTaskCompleted: boolean) {
    const objectTaskId = new ObjectId(taskId);
    const task: Task = await this.taskRepository.findOneBy({ _id: objectTaskId });

    if (!task) {
      throw new NotFoundException(exceptions.tasks.notFound);
    }

    if (task.status !== TaskStatus.ACCEPTED) {
      throw new ForbiddenException(exceptions.tasks.onlyForAccepted);
    }

    if (task.recipientId === user._id.toString()) {
      await this.taskRepository.update(
        { _id: objectTaskId },
        { confirmation: { ...task.confirmation, recipient: isTaskCompleted } }
      );
    } else if (task.volunteerId === user._id.toString()) {
      await this.taskRepository.update(
        { _id: objectTaskId },
        { confirmation: { ...task.confirmation, volunteer: isTaskCompleted } }
      );
    } else {
      throw new ForbiddenException(exceptions.tasks.wrongUser);
    }

    const updatedTask = await this.taskRepository.findOneBy({ _id: objectTaskId });

    if (
      updatedTask.confirmation.recipient !== null &&
      updatedTask.confirmation.volunteer !== null
    ) {
      if (
        updatedTask.confirmation.recipient === true &&
        updatedTask.confirmation.volunteer === true
      ) {
        await this.completeTask(updatedTask);
      } else if (
        updatedTask.confirmation.recipient === false &&
        updatedTask.confirmation.volunteer === false
      ) {
        await this.taskRepository.update(
          { _id: objectTaskId },
          { status: TaskStatus.CLOSED, completed: false }
        );
      } else {
        console.log('Вызывайте админа!!!'); // отбивка в чат админу
      }
    }

    return this.taskRepository.findOneBy({ _id: objectTaskId });
  }

  async update(id: string, user: User, updateTaskDto: UpdateTaskDto) {
    const objectTaskId = new ObjectId(id);
    const task: Task = await this.taskRepository.findOneBy({ _id: objectTaskId });

    if (!task) {
      throw new NotFoundException(exceptions.tasks.notFound);
    }

    if (task.status !== TaskStatus.CREATED) {
      throw new ForbiddenException(exceptions.tasks.onlyForCreated);
    }

    if (task.recipientId !== user._id.toString() && user.role === UserRole.RECIPIENT) {
      throw new ForbiddenException(exceptions.tasks.wrongUser);
    }

    await this.taskRepository.update({ _id: objectTaskId }, updateTaskDto);

    return this.taskRepository.findOneBy({ _id: objectTaskId });
  }
}
