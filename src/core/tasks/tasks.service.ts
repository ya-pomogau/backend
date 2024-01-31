import { ForbiddenException, Injectable } from '@nestjs/common';
import { FilterQuery } from 'mongoose';
import { TasksRepository } from '../../datalake/task/task.repository';
import { UsersRepository } from '../../datalake/users/users.repository';
import { CreateTaskDto, GetVirginTasksDto } from '../../common/dto/tasks.dto';
import { Recipient } from '../../datalake/users/schemas/recipient.schema';
import { Admin } from '../../datalake/users/schemas/admin.schema';
import { CategoryRepository } from '../../datalake/category/category.repository';
import { Task } from '../../datalake/task/schemas/task.schema';
import { ResolveStatus } from '../../common/types/task.types';

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
    if (!(recipient instanceof Recipient || recipient instanceof Admin)) {
      throw new ForbiddenException('Только реципиент или администратор могут создавать заявки', {
        cause: `Попытка создать заявку пользователем с _id ${recipientId} и ролью волонтёра`,
      });
    }
    const { name, phone, avatar, address, _id } = recipient;
    const task = {
      ...data,
      recipient: { name, phone, avatar, address, _id },
      volunteer: null,
      category,
      isPendingChanges: false,
    };
    return this.tasksRepo.create(task);
  }

  public async getVirginTasks(dto: GetVirginTasksDto) {
    const {
      location: { coordinates: center },
      distance,
      start,
      end,
      categoryId,
    } = dto;
    const query: FilterQuery<Task> = {
      volunteerReport: ResolveStatus.VIRGIN,
      recipientReport: ResolveStatus.VIRGIN,
      location: {
        $near: {
          $geometry: center,
          $maxDistance: distance,
        },
      },
    };
    if (categoryId) {
      query.category = await this.categoryRepo.findById(categoryId);
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

  public async getAcceptedTasks(dto: GetVirginTasksDto) {
    const {
      location: { coordinates: center },
      distance,
      start,
      end,
      categoryId,
    } = dto;
    const query: FilterQuery<Task> = {
      volunteerReport: ResolveStatus.VIRGIN,
      recipientReport: ResolveStatus.VIRGIN,
      location: {
        $near: {
          $geometry: center,
          $maxDistance: distance,
        },
      },
    };
    if (categoryId) {
      query.category = await this.categoryRepo.findById(categoryId);
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
}
