import { ConflictException, ForbiddenException, Injectable } from '@nestjs/common';
import { FilterQuery } from 'mongoose';
import { TasksRepository } from '../../datalake/task/task.repository';
import { UsersRepository } from '../../datalake/users/users.repository';
import { CreateTaskDto, GetTasksDto } from '../../common/dto/tasks.dto';
import { Recipient } from '../../datalake/users/schemas/recipient.schema';
import { Admin } from '../../datalake/users/schemas/admin.schema';
import { CategoryRepository } from '../../datalake/category/category.repository';
import { Task } from '../../datalake/task/schemas/task.schema';
import { ResolveStatus, TaskStatus } from '../../common/types/task.types';
import { UserRole } from '../../common/types/user.types';
import { Volunteer } from '../../datalake/users/schemas/volunteer.schema';
import { User } from '../../datalake/users/schemas/user.schema';

@Injectable()
export class TasksService {
  constructor(
    private readonly tasksRepo: TasksRepository,
    private readonly usersRepo: UsersRepository,
    private readonly categoryRepo: CategoryRepository
  ) {}

  public async create(dto: CreateTaskDto) {
    const { recipientId, categoryId, ...data } = dto;
    const recipient = await this.usersRepo.findById(recipientId);
    const category = await this.categoryRepo.findById(categoryId);
    /* !(recipient instanceof Recipient || recipient instanceof Admin) */
    if (![`${UserRole.ADMIN}`, `${UserRole.RECIPIENT}`].includes(recipient.role)) {
      throw new ForbiddenException('Только реципиент или администратор могут создавать заявки', {
        cause: `Попытка создать заявку пользователем с _id ${recipientId} и ролью волонтёра`,
      });
    }
    const { name, phone, avatar, address, _id } = recipient;
    const task = {
      ...data,
      recipient: { name, phone, avatar, address, _id },
      volunteer: null,
      status: TaskStatus.CREATED,
      category,
      isPendingChanges: false,
    };
    return this.tasksRepo.create(task);
  }

  public async getNotAcceptedTasks(dto: GetTasksDto) {
    const {
      location: { coordinates: center },
      distance,
      start,
      end,
      categoryId,
    } = dto;
    const query: FilterQuery<Task> = {
      volunteer: null,
      location: {
        $near: {
          $geometry: center,
          $maxDistance: distance,
        },
      },
    };
    if (categoryId) {
      query.category._id = categoryId;
    }
    if (!!start && !!end) {
      query.date = {
        $gte: start,
        $lte: end,
      };
    } else if (!!start && !end) {
      query.date = {
        $gte: start,
      };
    } else if (!start && !!end) {
      query.date = {
        $lte: end,
      };
    }
    return this.tasksRepo.find(query);
  }

  public async getAcceptedTasks(dto: GetTasksDto) {
    const {
      location: { coordinates: center },
      distance,
      start,
      end,
      categoryId,
    } = dto;
    const query: FilterQuery<Task> = {
      status: TaskStatus.ACCEPTED,
      location: {
        $near: {
          $geometry: center,
          $maxDistance: distance,
        },
      },
    };
    if (categoryId) {
      query.category._id = categoryId;
    }
    if (!!start && !!end) {
      query.date = {
        $gte: start,
        $lte: end,
      };
    } else if (!!start && !end) {
      query.date = {
        $gte: start,
      };
    } else if (!start && !!end) {
      query.date = {
        $lte: end,
      };
    }
    return this.tasksRepo.find(query);
  }

  async acceptTask(taskId: string, volunteerId: string) {
    const volunteer = (await this.usersRepo.findById(volunteerId)) as User & Volunteer;
    if (![`${UserRole.ADMIN}`, `${UserRole.VOLUNTEER}`].includes(volunteer.role)) {
      throw new ForbiddenException('Только волонтёр или администратор могут создавать заявки', {
        cause: `Попытка создать заявку пользователем с _id '${volunteerId}' и ролью '${volunteer.role}'`,
      });
    }
    const task = await this.tasksRepo.findById(taskId);
    if (task.volunteer) {
      throw new ConflictException('Эта заявка уже взята другим волонтёром', {
        cause: `Попытка повторно взять заявку с _id '${taskId}' пользователем с _id '${volunteerId}' и ролью '${volunteer.role}'`,
      });
    }
    if (volunteer.status < task.category.accessLevel) {
      throw new ForbiddenException('Вам нельзя брать задачи из этой категории!');
    }
    const { name, phone, avatar, address, _id } = volunteer;
    return this.tasksRepo.findByIdAndUpdate(
      taskId,
      { status: TaskStatus.ACCEPTED, volunteer: { name, phone, avatar, address, _id } },
      { new: true }
    );
  }
}
