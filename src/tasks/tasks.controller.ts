import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';

import {
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';

import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { User } from '../users/entities/user.entity';
import { TasksWsGateway } from '../tasks-ws/tasks-ws.gateway';
import { WsTasksEvents } from '../tasks-ws/types';
import { AuthUser } from '../auth/decorators/auth-user.decorator';
import { JwtGuard } from '../auth/guards/jwt.guard';

import { AdminPermission, EUserRole } from '../users/types';

import { UserRoles } from '../auth/decorators/user-roles.decorator';
import { UserRolesGuard } from '../auth/guards/user-roles.guard';
import { AdminPermissionsGuard } from '../auth/guards/admin-permissions.guard';
import { AdminPermissions } from '../auth/decorators/admin-permissions.decorator';
import { ConfirmTaskDto } from './dto/confirm-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Task } from './entities/task.entity';
import { TaskQueryDto } from './dto/task-query.dto';

import exceptions from '../common/constants/exceptions';

@ApiBearerAuth()
@ApiTags('Tasks')
@UseGuards(JwtGuard)
@Controller('tasks')
export class TasksController {
  constructor(
    private readonly tasksService: TasksService,
    private readonly tasksGateway: TasksWsGateway
  ) {}

  @ApiOperation({
    summary: 'Создание новой заявки',
    description:
      'При создании заявки реципиентом поле recipientId будет получено из контекста, при создании заявки администратором необходимо указать валидный recipientID. ' +
      '<br >Невозможно создать заявку с recipientId, у которого есть незакрытая заявка в указанной категории.' +
      '<br>Поле points устанавливается согласно категории заявки. При обновлении баллов за категорию во всех незакрытых заявках поле points будет обновлено.' +
      '<br>Поле accessStatus контролирует видимость и возможность принять заявку до волонтеров с соответствующими статусами. Устанавливается согласно категории заявки.',
  })
  @ApiOkResponse({
    status: 200,
    type: Task,
  })
  @UseGuards(UserRolesGuard, AdminPermissionsGuard)
  @UserRoles(EUserRole.RECIPIENT, EUserRole.ADMIN, EUserRole.MASTER)
  @AdminPermissions(AdminPermission.TASKS)
  @Post()
  async create(@Body() createTaskDto: CreateTaskDto, @AuthUser() user: User): Promise<Task> {
    const newTask = await this.tasksService.create(createTaskDto, user);

    this.tasksGateway.sendMessage(
      {
        event: WsTasksEvents.CREATED,
        data: newTask,
      },
      newTask.accessStatus
    );

    return newTask;
  }

  @ApiOperation({
    summary: 'Поиск заявок по параметрам',
    description: 'Доступ только для администраторов',
  })
  @ApiQuery({ type: TaskQueryDto })
  @ApiOkResponse({
    status: 200,
    type: Task,
    isArray: true,
  })
  @ApiForbiddenResponse({
    status: 403,
    description: exceptions.users.onlyForAdmins,
  })
  @UseGuards(UserRolesGuard)
  @UserRoles(EUserRole.ADMIN, EUserRole.MASTER)
  @Get('find')
  async findBy(@Query() query: object): Promise<Task[]> {
    return this.tasksService.findBy(query);
  }

  @ApiOperation({
    summary: 'Список созданных или принятых заявок авторизованного пользователя',
    description: 'Доступ только для волонтеров и реципиентов',
  })
  @ApiOkResponse({
    status: 200,
    type: Task,
    isArray: true,
  })
  @ApiForbiddenResponse({
    status: 403,
    description: `${exceptions.users.onlyForVolunteers} ${exceptions.users.onlyForRecipients}`,
  })
  @UseGuards(UserRolesGuard)
  @UserRoles(EUserRole.RECIPIENT, EUserRole.VOLUNTEER)
  @Get('own')
  async findOwn(@Query('status') status: string, @AuthUser() user: User): Promise<Task[]> {
    return this.tasksService.findOwn(status, user);
  }

  @ApiOperation({
    summary: 'Список всех заявок',
    description: 'Доступ только для администраторов',
  })
  @ApiOkResponse({
    status: 200,
    type: Task,
    isArray: true,
  })
  @ApiForbiddenResponse({
    status: 403,
    description: exceptions.users.onlyForAdmins,
  })
  @UseGuards(UserRolesGuard)
  @UserRoles(EUserRole.ADMIN, EUserRole.MASTER)
  @Get()
  async findAll(): Promise<Task[]> {
    return this.tasksService.findAll();
  }

  @ApiOperation({
    summary: 'Поиск заявки по id',
  })
  @ApiOkResponse({
    status: 200,
    type: Task,
  })
  @Get(':id')
  async findById(@Param('id') id: string, @AuthUser() user: User): Promise<Task> {
    return this.tasksService.findById(id, user);
  }

  @ApiOperation({
    summary: 'Отклик на заявку',
    description: 'Доступ только для волонтеров',
  })
  @ApiOkResponse({
    status: 200,
    type: Task,
  })
  @ApiForbiddenResponse({
    status: 403,
    description: exceptions.users.onlyForVolunteers,
  })
  @UseGuards(UserRolesGuard)
  @UserRoles(EUserRole.VOLUNTEER)
  @Patch(':id/accept')
  async acceptTask(@Param('id') taskId: string, @AuthUser() user: User): Promise<Task> {
    const acceptedTask = await this.tasksService.acceptTask(taskId, user);

    this.tasksGateway.sendMessage(
      {
        event: WsTasksEvents.ACCEPTED,
        data: acceptedTask,
      },
      acceptedTask.accessStatus
    );

    return acceptedTask;
  }

  @ApiOperation({
    summary: 'Отказ от заявки',
    description:
      'Доступ только для волонтеров и администраторов. Волонтер не может отказаться от заявки, до старта которой осталось менее 24 часов. Администратор может отменить отклик в любое время.',
  })
  @ApiOkResponse({
    status: 200,
    type: Task,
  })
  @ApiForbiddenResponse({
    status: 403,
    description: `${exceptions.users.onlyForVolunteers} ${exceptions.users.onlyForAdmins}`,
  })
  @UseGuards(UserRolesGuard, AdminPermissionsGuard)
  @UserRoles(EUserRole.VOLUNTEER, EUserRole.ADMIN, EUserRole.MASTER)
  @AdminPermissions(AdminPermission.TASKS, AdminPermission.CONFLICTS)
  @Patch(':id/refuse')
  async refuseTask(@Param('id') id: string, @AuthUser() user: User): Promise<Task> {
    const refusedTask = await this.tasksService.refuseTask(id, user);

    this.tasksGateway.sendMessage(
      {
        event: WsTasksEvents.REFUSED,
        data: refusedTask,
      },
      refusedTask.accessStatus
    );

    return refusedTask;
  }

  @ApiOperation({
    summary: 'Удаление заявки по id',
    description:
      'Доступ только для реципиентов и администраторов. Реципиент может удалить только свою заявку, которую не принял волонтер. Администратор может удалить любую заявку.',
  })
  @ApiOkResponse({
    status: 200,
    type: Task,
  })
  @ApiForbiddenResponse({
    status: 403,
    description: `${exceptions.users.onlyForRecipients} ${exceptions.users.onlyForAdmins}`,
  })
  @UseGuards(UserRolesGuard, AdminPermissionsGuard)
  @UserRoles(EUserRole.RECIPIENT, EUserRole.ADMIN, EUserRole.MASTER)
  @AdminPermissions(AdminPermission.TASKS)
  @Delete(':id')
  async deleteTask(@Param('id') id: string, @AuthUser() user: User): Promise<Task> {
    const deletedTask = await this.tasksService.removeTask(id, user);

    this.tasksGateway.sendMessage(
      {
        event: WsTasksEvents.CLOSED,
        data: deletedTask,
      },
      deletedTask.accessStatus
    );

    return deletedTask;
  }

  @ApiOperation({
    summary: 'Ручное закрытие заявки',
    description:
      'Доступ только для администраторов с соответствующими правами. Если заявка была выполнена, необходимо передать query ?completed=true. Если не была выполнена, query можно не передавать.',
  })
  @ApiOkResponse({
    status: 200,
    type: Task,
  })
  @ApiForbiddenResponse({
    status: 403,
    description: exceptions.users.onlyForAdmins,
  })
  @UseGuards(UserRolesGuard, AdminPermissionsGuard)
  @UserRoles(EUserRole.ADMIN, EUserRole.MASTER)
  @AdminPermissions(AdminPermission.TASKS, AdminPermission.CONFLICTS)
  @Patch(':id/close')
  async closeTask(@Param('id') id: string, @Query('completed') completed: boolean): Promise<Task> {
    const closedTask = await this.tasksService.closeTask(id, completed);

    this.tasksGateway.sendMessage(
      {
        event: WsTasksEvents.CLOSED,
        data: closedTask,
      },
      closedTask.accessStatus
    );

    return closedTask;
  }

  @ApiOperation({
    summary: 'Подтверждение выполнения заявки',
    description:
      'Доступ только для волонтеров и реципиентов, учавствующих в заявке. ' +
      '<br>Каждый участник передает в поле confirmation булевое значение. Если они совпадают, заявка закрывается с соответствующим значение поля completed, волонтер получает/не получает баллы за выполнение.' +
      ' Если не совпадают, администратору приходит отбивка в чат о конфликте - необходимо ручное закрытие.',
  })
  @ApiOkResponse({
    status: 200,
    type: Task,
  })
  @ApiForbiddenResponse({
    status: 403,
    description: `${exceptions.users.onlyForRecipients} ${exceptions.users.onlyForVolunteers}`,
  })
  @UseGuards(UserRolesGuard)
  @UserRoles(EUserRole.RECIPIENT, EUserRole.VOLUNTEER)
  @Patch(':id/confirm')
  async confirmTask(
    @Param('id') id: string,
    @Body(new ValidationPipe({ whitelist: true })) confirmTaskDto: ConfirmTaskDto,
    @AuthUser() user: User
  ): Promise<Task> {
    return this.tasksService.confirmTask(id, user, confirmTaskDto.completed);
  }

  @ApiOperation({
    summary: 'Редактирование заявки',
    description:
      'Доступ только для реципиентов и администраторов. Нельзя редактировать поле recipientId. Нельзя редактировать принятую волонтером заявку.',
  })
  @ApiOkResponse({
    status: 200,
    type: Task,
  })
  @ApiForbiddenResponse({
    status: 403,
    description: `${exceptions.users.onlyForRecipients} ${exceptions.users.onlyForAdmins}`,
  })
  @UseGuards(UserRolesGuard, AdminPermissionsGuard)
  @UserRoles(EUserRole.RECIPIENT, EUserRole.ADMIN, EUserRole.MASTER)
  @AdminPermissions(AdminPermission.TASKS, AdminPermission.CONFLICTS)
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body(new ValidationPipe({ whitelist: true })) updateTaskDto: UpdateTaskDto,
    @AuthUser() user: User
  ): Promise<Task> {
    const updatedTask = await this.tasksService.update(id, user, updateTaskDto);

    this.tasksGateway.sendMessage(
      {
        event: WsTasksEvents.UPDATED,
        data: updatedTask,
      },
      updatedTask.accessStatus
    );

    return updatedTask;
  }
}
