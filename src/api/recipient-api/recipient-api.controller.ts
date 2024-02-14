import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { TasksService } from '../../core/tasks/tasks.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { AccessControlGuard } from '../../common/guards/access-control.guard';
import { ApiCreateTaskDto } from './dto/create-task.dto';
import { AccessControlList } from '../../common/decorators/access-control-list.decorator';
import { AnyUserInterface, UserRole, UserStatus } from '../../common/types/user.types';
import { GetTasksSearchDto } from './dto/get-tasks-query.dto';
import { TaskReport, TaskStatus } from '../../common/types/task.types';

@UseGuards(JwtAuthGuard)
@UseGuards(AccessControlGuard)
@Controller('recipient')
export class RecipientApiController {
  constructor(private readonly tasksService: TasksService) {}

  @Post('/tasks')
  @AccessControlList({ role: UserRole.RECIPIENT, level: UserStatus.CONFIRMED })
  public async create(@Body() dto: ApiCreateTaskDto, @Req() { user: { _id: recipientId } }) {
    return this.tasksService.create({ ...dto, recipientId });
  }

  @Get('/tasks/virgin')
  @AccessControlList({ role: UserRole.RECIPIENT, level: UserStatus.CONFIRMED })
  public async getVirginTasks(@Query() query: GetTasksSearchDto) {
    return this.tasksService.getTasksByStatus(TaskStatus.CREATED, query);
  }

  @Get('/tasks/:id')
  @AccessControlList({ role: UserRole.RECIPIENT, level: UserStatus.CONFIRMED })
  public async getTaskById(@Param(':id') id: string) {
    return this.tasksService.getTask(id);
  }

  @Patch('/tasks/:id')
  @AccessControlList({ role: UserRole.RECIPIENT, level: UserStatus.CONFIRMED })
  public async updateTask(
    @Param(':id') id: string,
    @Req() { user },
    @Body() dto: Partial<ApiCreateTaskDto>
  ) {
    return this.tasksService.updateTask(id, user as AnyUserInterface, dto);
  }

  @Put('/tasks/:id/fulfill')
  @AccessControlList({ role: UserRole.RECIPIENT, level: UserStatus.CONFIRMED })
  public async fulfillTask(@Param(':id') id: string, @Req() { user: { _id: userId } }) {
    return this.tasksService.reportTask(id, userId, UserRole.RECIPIENT, TaskReport.FULFILLED);
  }

  @Put('/tasks/:id/reject')
  @AccessControlList({ role: UserRole.RECIPIENT, level: UserStatus.CONFIRMED })
  public async rejectTask(@Param(':id') id: string, @Req() { user: { _id: userId } }) {
    return this.tasksService.reportTask(id, userId, UserRole.RECIPIENT, TaskReport.REJECTED);
  }

  @Get('/tasks/accepted')
  @AccessControlList({ role: UserRole.RECIPIENT, level: UserStatus.CONFIRMED })
  public async getAcceptedTasks(@Query() query: GetTasksSearchDto, @Req() { user }) {
    const { latitude, longitude, ...data } = query;
    return this.tasksService.getOwnTasks(user, TaskStatus.ACCEPTED, {
      ...data,
      location: [longitude, latitude],
    });
  }

  @Get('/tasks/completed')
  @AccessControlList({ role: UserRole.RECIPIENT, level: UserStatus.CONFIRMED })
  public async getCompletedTasks(@Query() query: GetTasksSearchDto, @Req() { user }) {
    const { latitude, longitude, ...data } = query;
    return this.tasksService.getOwnTasks(user, TaskStatus.COMPLETED, {
      ...data,
      location: [longitude, latitude],
    });
  }
}
