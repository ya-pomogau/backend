import { Controller, Get, Param, Put, Query, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { AccessControlGuard } from '../../common/guards/access-control.guard';
import { UsersService } from '../../core/users/users.service';
import { TasksService } from '../../core/tasks/tasks.service';
import { AccessControlList } from '../../common/decorators/access-control-list.decorator';
import { AnyUserInterface, UserRole, UserStatus } from '../../common/types/user.types';
import { GetTasksSearchDto } from '../recipient-api/dto/get-tasks-query.dto';
import { TaskReport, TaskStatus } from '../../common/types/task.types';

@UseGuards(JwtAuthGuard)
@UseGuards(AccessControlGuard)
@Controller('volunteer')
export class VolunteerApiController {
  constructor(
    private readonly usersService: UsersService,
    private readonly tasksService: TasksService
  ) {}

  @AccessControlList({ role: UserRole.VOLUNTEER, level: UserStatus.CONFIRMED })
  @Get('tasks/virgin')
  public async getNewTasks(@Query() query: GetTasksSearchDto) {
    const { latitude, longitude, distance, ...data } = query;
    return this.tasksService.getTasksByStatus(TaskStatus.CREATED, {
      ...data,
      location: [longitude, latitude],
      distance,
    });
  }

  @AccessControlList({ role: UserRole.VOLUNTEER, level: UserStatus.CONFIRMED })
  @Put('tasks/:id/accept')
  public async accept(@Req() req: Express.Request, @Param('id') taskId: string) {
    const {
      user: { _id: volunteerId },
    } = req;
    return this.tasksService.acceptTask(taskId, volunteerId);
  }

  @Put('/tasks/:id/fulfill')
  @AccessControlList({ role: UserRole.VOLUNTEER, level: UserStatus.CONFIRMED })
  public async fulfillTask(@Param('id') id: string, @Req() req: Express.Request) {
    const {
      user: { _id: userId },
    } = req;
    return this.tasksService.reportTask(id, userId, UserRole.VOLUNTEER, TaskReport.FULFILLED);
  }

  @Put('/tasks/:id/reject')
  @AccessControlList({ role: UserRole.VOLUNTEER, level: UserStatus.CONFIRMED })
  public async rejectTask(@Param('id') id: string, @Req() req: Express.Request) {
    const {
      user: { _id: userId },
    } = req;
    return this.tasksService.reportTask(id, userId, UserRole.VOLUNTEER, TaskReport.REJECTED);
  }

  @Get('/tasks/accepted')
  @AccessControlList({ role: UserRole.VOLUNTEER, level: UserStatus.CONFIRMED })
  public async getAcceptedTasks(@Query() query: GetTasksSearchDto, @Req() req: Express.Request) {
    const { latitude, longitude, ...data } = query;
    return this.tasksService.getOwnTasks(req.user as AnyUserInterface, TaskStatus.ACCEPTED, {
      ...data,
      location: [longitude, latitude],
    });
  }

  @Get('/tasks/completed')
  @AccessControlList({ role: UserRole.VOLUNTEER, level: UserStatus.CONFIRMED })
  public async getCompletedTasks(@Query() query: GetTasksSearchDto, @Req() req: Express.Request) {
    const { latitude, longitude, ...data } = query;
    const completed = await this.tasksService.getOwnTasks(
      req.user as AnyUserInterface,
      TaskStatus.COMPLETED,
      {
        ...data,
        location: [longitude, latitude],
      }
    );
    const conflicted = await this.tasksService.getOwnTasks(
      req.user as AnyUserInterface,
      TaskStatus.CONFLICTED,
      {
        ...data,
        location: [longitude, latitude],
      }
    );
    return Promise.resolve([...completed, ...conflicted]);
  }
}
