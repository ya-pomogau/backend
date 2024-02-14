import { ConflictException, ForbiddenException, Injectable } from '@nestjs/common';
import { FilterQuery } from 'mongoose';
import { TasksRepository } from '../../datalake/task/task.repository';
import { UsersRepository } from '../../datalake/users/users.repository';
import { CreateTaskDto, GetTasksDto } from '../../common/dto/tasks.dto';
import { CategoryRepository } from '../../datalake/category/category.repository';
import { Task } from '../../datalake/task/schemas/task.schema';
import { ResolveStatus, TaskReport, TaskStatus } from '../../common/types/task.types';
import { UserRole, AnyUserInterface } from '../../common/types/user.types';
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
    if (![`${UserRole.ADMIN}`, `${UserRole.RECIPIENT}`].includes(recipient.role)) {
      throw new ForbiddenException('Только реципиент или администратор могут создавать заявки', {
        cause: `Попытка создать заявку пользователем с _id ${recipientId} и ролью ${recipient.role}`,
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
      location: { type: 'Point', coordinates: location },
    };
    return this.tasksRepo.create(task);
  }

  public async getTask(taskId: string) {
    return this.tasksRepo.findById(taskId);
  }

  public async getVirginTasks() {
    return this.tasksRepo.find({ status: TaskStatus.CREATED, volunteer: null });
  }

  public async updateTask(taskId: string, user: AnyUserInterface, dto: Partial<CreateTaskDto>) {
    const { role, _id: userId } = user;
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
      query.recipient._id = userId;
    }
    return this.tasksRepo.findOneAndUpdate(query, dto, { new: true });
  }

  public async getTasksByStatus(taskStatus: TaskStatus, dto: Partial<GetTasksDto>) {
    console.log(`TaskStatus: '${taskStatus}', dto:`);
    console.dir(dto);
    const { location: center, distance, start, end, categoryId } = dto;
    console.dir(center);
    const query: FilterQuery<Task> = {
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
    const { location: center, distance, start, end, categoryId } = dto;
    const { _id, role } = user;
    const roleIndex = role.toLowerCase();
    const query: FilterQuery<Task> = {
      status,
      [roleIndex]: { _id },
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

  public async reportTask(taskId: string, userId: string, userRole: UserRole, result: TaskReport) {
    const myIndex = userRole === UserRole.VOLUNTEER ? 'volunteerReport' : 'recipientReport';
    const counterpartyIndex =
      userRole === UserRole.RECIPIENT ? 'volunteerReport' : 'recipientReport';
    const task = await this.tasksRepo.findById(taskId);
    if (task.status !== TaskStatus.ACCEPTED) {
      throw new ForbiddenException('Нельзя отчитаться по не открытой задаче!', {
        cause: `Попытка отчёта по задаче с _id '${task._id}' со статусом ${task.status} `,
      });
    }
    if (task[counterpartyIndex]) {
      this.tasksRepo.findByIdAndUpdate(
        taskId,
        {
          ...task,
          [myIndex]: result,
          status: result === task[counterpartyIndex] ? TaskStatus.COMPLETED : TaskStatus.CONFLICTED,
          adminResolve: result === task[counterpartyIndex] ? null : ResolveStatus.VIRGIN,
          isPendingChanges: false,
        },
        { new: true }
      );
    } else {
      this.tasksRepo.findByIdAndUpdate(
        taskId,
        {
          ...task,
          [myIndex]: result,
          isPendingChanges: true,
        },
        { new: true }
      );
    }
  }
}
