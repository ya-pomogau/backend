import { ConflictException, ForbiddenException, Injectable } from '@nestjs/common';
import { FilterQuery } from 'mongoose';
import { TasksRepository } from '../../datalake/task/task.repository';
import { UsersRepository } from '../../datalake/users/users.repository';
import { CreateTaskDto, GetTasksDto } from '../../common/dto/tasks.dto';
import { CategoryRepository } from '../../datalake/category/category.repository';
import { Task } from '../../datalake/task/schemas/task.schema';
import {
  ResolveResult,
  ResolveStatus,
  TaskInterface,
  TaskReport,
  TaskStatus,
} from '../../common/types/task.types';
import { AnyUserInterface, UserRole } from '../../common/types/user.types';
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
    const { recipientId, categoryId, location, ...data } = dto;
    const recipient = await this.usersRepo.findById(recipientId);
    const category = await this.categoryRepo.findById(categoryId);
    const { points, accessLevel, title } = category;
    if (![`${UserRole.ADMIN}`, `${UserRole.RECIPIENT}`].includes(recipient.role)) {
      throw new ForbiddenException('Только реципиент или администратор могут создавать заявки', {
        cause: `Попытка создать заявку пользователем с _id ${recipientId} и ролью ${recipient.role}`,
      });
    }
    const { name, phone, avatar, address, _id, vkId, role } = recipient;
    const task = {
      ...data,
      recipient: { name, phone, avatar, address, _id, vkId, role },
      volunteer: null,
      status: TaskStatus.CREATED,
      category: { points, accessLevel, title, _id: categoryId },
      isPendingChanges: false,
      location: { type: 'Point', coordinates: location },
    };
    return this.tasksRepo.create(task);
  }

  public async getTask(taskId: string) {
    return this.tasksRepo.findById(taskId);
  }

  public async getVirginConflictTasks() {
    return this.tasksRepo.find({
      status: TaskStatus.CONFLICTED,
      adminResolve: ResolveStatus.VIRGIN,
    });
  }

  public async getAllVirginTasks(dto: Partial<GetTasksDto>) {
    const { location: center, distance } = dto;
    const query: FilterQuery<Task> = {
      status: TaskStatus.CREATED,
      location: {
        $near: {
          $geometry: { type: 'Point', coordinates: center },
          $maxDistance: distance,
        },
      },
    };
    return this.tasksRepo.find(query);
  }

  public async startModeration(taskId: string, moderator: AnyUserInterface) {
    const { name, phone, avatar, address, _id, vkId, role } = moderator;
    const task = await this.tasksRepo.findById(taskId);
    if (moderator.role !== UserRole.ADMIN) {
      throw new ForbiddenException('Только администратор может разрешать конфликты', {
        cause: `Попытка взять на модерацию задачу пользователем с _id '${moderator._id}' и ролью '${moderator.role}'`,
      });
    }
    if (
      task.status !== TaskStatus.CONFLICTED ||
      task.adminResolve !== ResolveStatus.VIRGIN ||
      !!task.moderator
    ) {
      throw new ForbiddenException('Задача не является конфликтной или конфликт уже модерируется', {
        cause: `Попытка администратора с _id '${_id}' взять на модерирование задачу с _id '${taskId}', у которой status = '${
          task.status
        }, adminResolve = '${task.adminResolve}', а moderator ${
          task.moderator ? 'не' : ''
        } равен null.`,
      });
    }
    return this.tasksRepo.findOneAndUpdate(
      { _id: taskId, status: TaskStatus.CONFLICTED, adminResolve: ResolveStatus.VIRGIN },
      {
        adminResolve: ResolveStatus.PENDING,
        moderator: { name, phone, avatar, address, _id, vkId, role },
      },
      {}
    );
  }

  public async resolveConflict(taskId: string, outcome: ResolveResult) {
    return this.tasksRepo.findOneAndUpdate(
      { _id: taskId, status: TaskStatus.CONFLICTED, adminResolve: ResolveStatus.PENDING },
      { status: TaskStatus.COMPLETED, adminResolve: outcome },
      {}
    );
  }

  public async getModeratedTasks(moderator: AnyUserInterface) {
    const { _id, role, address, avatar, name, phone } = moderator;
    return this.tasksRepo.find({
      status: TaskStatus.CONFLICTED,
      adminResolve: ResolveStatus.PENDING,
      moderator: { _id, role, address, avatar, name, phone },
    });
  }

  public async updateTask(taskId: string, user: AnyUserInterface, dto: Partial<CreateTaskDto>) {
    const { _id: userId, role, address, avatar, name, phone } = user;
    if (!(role === UserRole.RECIPIENT || role === UserRole.ADMIN)) {
      throw new ForbiddenException(
        'Вы не можете редактировать эту задачу: недостаточно полномочий',
        {
          cause: `Попытка редактировать задачу '${taskId} пользователем '${userId} с ролью '${role}'. `,
        }
      );
    }
    const query: FilterQuery<Task> = {
      _id: taskId,
      status: TaskStatus.CREATED,
    };
    if (role === UserRole.RECIPIENT) {
      query.recipient = { _id: userId, address, avatar, name, phone };
    }
    return this.tasksRepo.findOneAndUpdate(query, dto, { new: true });
  }

  public async getTasksByStatus(
    taskStatus: TaskStatus,
    dto: Partial<GetTasksDto>,
    user?: AnyUserInterface
  ) {
    const { location: center, distance, start, end, categoryId } = dto;
    const query: FilterQuery<TaskInterface> = {
      status: taskStatus,
      location: {
        $near: {
          $geometry: { type: 'Point', coordinates: center },
          $maxDistance: distance,
        },
      },
    };
    if (categoryId) {
      query.category._id = categoryId;
    }
    if (!!user && !!user.status) {
      query.category.accessLevel = { $lte: user.status };
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

  public async getOwnTasks(user: AnyUserInterface, status: TaskStatus, dto?: GetTasksDto) {
    const { location: center, distance, start, end, categoryId } = dto ?? {};
    const { _id, role, address, avatar, name, phone } = user;
    const roleIndex = role.toLowerCase();
    const query: FilterQuery<Task> = {
      status,
      [roleIndex]: { _id, address, avatar, name, phone },
    };
    if (!!center && center.length === 2 && !!distance) {
      query.location = {
        $near: {
          $geometry: center,
          $maxDistance: distance,
        },
      };
    }
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

  public async acceptTask(taskId: string, volunteerId: string) {
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
    if (task.status !== TaskStatus.CREATED) {
      throw new ConflictException(
        `Нельзя повторно принять уже ${
          task.status === TaskStatus.COMPLETED ? 'завершённое' : 'исполняемое'
        } задание`,
        {
          cause: `Попытка взять заявку со статусом '${task.status}' !=== '${TaskStatus.CREATED}' пользователем с _id '${volunteerId}' и ролью '${volunteer.role}'`,
        }
      );
    }
    if (volunteer.status < task.category.accessLevel) {
      throw new ForbiddenException('Вам нельзя брать задачи из этой категории!');
    }
    const { name, phone, avatar, address, _id, vkId, role } = volunteer;
    return this.tasksRepo.findByIdAndUpdate(
      taskId,
      { status: TaskStatus.ACCEPTED, volunteer: { name, phone, avatar, address, _id, vkId, role } },
      { new: true }
    );
  }

  public async reportTask(taskId: string, userId: string, userRole: UserRole, result: TaskReport) {
    const myIndex = userRole === UserRole.VOLUNTEER ? 'volunteerReport' : 'recipientReport';
    const counterpartyIndex =
      userRole === UserRole.RECIPIENT ? 'volunteerReport' : 'recipientReport';
    const task = await this.tasksRepo.findById(taskId);
    if (task.status === TaskStatus.CREATED) {
      throw new ForbiddenException('Нельзя отчитаться по не открытой задаче!', {
        cause: `Попытка отчёта по задаче с _id '${task._id}' со статусом ${task.status} `,
      });
    } else if (
      task.status === TaskStatus.COMPLETED ||
      task.status === TaskStatus.CONFLICTED ||
      !!task[myIndex]
    ) {
      throw new ConflictException('Нельзя повторно отчитаться по задаче!', {
        cause: `Попытка повторного  отчёта по задаче с _id '${task._id}' со статусом ${task.status} `,
      });
    }
    if (task[counterpartyIndex]) {
      return this.tasksRepo.findByIdAndUpdate(
        taskId,
        {
          [myIndex]: result,
          status: result === task[counterpartyIndex] ? TaskStatus.COMPLETED : TaskStatus.CONFLICTED,
          adminResolve: result === task[counterpartyIndex] ? null : ResolveStatus.VIRGIN,
          isPendingChanges: false,
        },
        { new: true }
      );
    }
    return this.tasksRepo.findByIdAndUpdate(
      taskId,
      {
        [myIndex]: result,
        isPendingChanges: true,
      },
      { new: true }
    );
  }

  public async cancelTask(taskId: string, user: AnyUserInterface) {
    const task = await this.tasksRepo.findById(taskId);
    const { recipient, volunteer } = task;
    if (recipient._id !== user._id) {
      throw new ForbiddenException('Нельзя отменить чужую задачу!', {
        cause: `Попытка пользователя с _id '${user._id} удалить задачу с _id '${taskId}', созданную не им`,
      });
    }
    if (volunteer) {
      throw new ForbiddenException('Нельзя отменить задачу, которую уже взял волонтёр!', {
        cause: `Попытка пользователя с _id '${user._id} удалить задачу с _id '${taskId}', которую уже взял волонтёр с _id '${volunteer._id}`,
      });
    }
    return this.tasksRepo.deleteOne({ _id: taskId }, {});
  }

  /**
   * Изменение баллов незакрытых задач в категории
   */
  public async updatePointsByCategory(categoryId: string, points: number) {
    try {
      return this.tasksRepo.updateMany(
        { category: categoryId, status: { $ne: TaskStatus.COMPLETED } },
        { $set: { points } },
        { new: true }
      );
    } catch (error) {
      throw new Error(`Error updating points by category: ${error.message}`);
    }
  }
}
