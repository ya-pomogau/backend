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
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { User } from '../users/entities/user.entity';
import { TasksWsGateway } from '../tasks-ws/tasks-ws.gateway';
import { WsTasksEvents } from '../tasks-ws/types';
import { AuthUser } from '../auth/decorators/auth-user.decorator';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { AdminPermission, UserRole } from '../users/types';
import { UserRoles } from '../auth/decorators/user-roles.decorator';
import { UserRolesGuard } from '../auth/guards/user-roles.guard';
import { AdminPermissionsGuard } from '../auth/guards/admin-permissions.guard';
import { AdminPermissions } from '../auth/decorators/admin-permissions.decorator';
import { ConfirmTaskDto } from './dto/confirm-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@UseGuards(JwtGuard)
@Controller('tasks')
export class TasksController {
  constructor(
    private readonly tasksService: TasksService,
    private readonly tasksGateway: TasksWsGateway
  ) {}

  @UseGuards(UserRolesGuard, AdminPermissionsGuard)
  @UserRoles(UserRole.RECIPIENT, UserRole.ADMIN, UserRole.MASTER)
  @AdminPermissions(AdminPermission.TASKS)
  @Post()
  async create(
    @Body(new ValidationPipe({ whitelist: true })) createTaskDto: CreateTaskDto,
    @AuthUser() user: User
  ) {
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

  @UseGuards(UserRolesGuard)
  @UserRoles(UserRole.ADMIN, UserRole.MASTER)
  @Get('find')
  async findBy(@Query() query: object) {
    return this.tasksService.findBy(query);
  }

  @UseGuards(UserRolesGuard)
  @UserRoles(UserRole.RECIPIENT, UserRole.VOLUNTEER)
  @Get('own')
  async findOwn(@Query('status') status: string, @AuthUser() user: User) {
    return this.tasksService.findOwn(status, user);
  }

  @UseGuards(UserRolesGuard)
  @UserRoles(UserRole.ADMIN, UserRole.MASTER)
  @Get()
  async findAll() {
    return this.tasksService.findAll();
  }

  @Get(':id')
  async findById(@Param('id') id: string, @AuthUser() user: User) {
    return this.tasksService.findById(id, user);
  }

  @UseGuards(UserRolesGuard)
  @UserRoles(UserRole.VOLUNTEER)
  @Patch(':taskId/accept')
  async acceptTask(@Param('taskId') taskId: string, @AuthUser() user: User) {
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

  @UseGuards(UserRolesGuard, AdminPermissionsGuard)
  @UserRoles(UserRole.VOLUNTEER, UserRole.ADMIN, UserRole.MASTER)
  @AdminPermissions(AdminPermission.TASKS, AdminPermission.CONFLICTS)
  @Patch(':id/refuse')
  async refuseTask(@Param('id') id: string, @AuthUser() user: User) {
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

  @UseGuards(UserRolesGuard, AdminPermissionsGuard)
  @UserRoles(UserRole.RECIPIENT, UserRole.ADMIN, UserRole.MASTER)
  @AdminPermissions(AdminPermission.TASKS)
  @Delete(':id')
  async deleteTask(@Param('id') id: string, @AuthUser() user: User) {
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

  @UseGuards(UserRolesGuard, AdminPermissionsGuard)
  @UserRoles(UserRole.ADMIN, UserRole.MASTER)
  @AdminPermissions(AdminPermission.TASKS, AdminPermission.CONFLICTS)
  @Patch(':id/close')
  async closeTask(@Param('id') id: string, @Query('completed') completed: boolean) {
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

  @UseGuards(UserRolesGuard)
  @UserRoles(UserRole.RECIPIENT, UserRole.VOLUNTEER)
  @Patch(':id/confirm')
  async confirmTask(
    @Param('id') id: string,
    @Body(new ValidationPipe({ whitelist: true })) confirmTaskDto: ConfirmTaskDto,
    @AuthUser() user: User
  ) {
    return this.tasksService.confirmTask(id, user, confirmTaskDto.completed);
  }

  @UseGuards(UserRolesGuard, AdminPermissionsGuard)
  @UserRoles(UserRole.RECIPIENT, UserRole.ADMIN, UserRole.MASTER)
  @AdminPermissions(AdminPermission.TASKS, AdminPermission.CONFLICTS)
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body(new ValidationPipe({ whitelist: true })) updateTaskDto: UpdateTaskDto,
    @AuthUser() user: User
  ) {
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
