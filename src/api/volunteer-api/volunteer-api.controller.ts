import { Controller, Get, Param, Put, Query, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { AccessControlGuard } from '../../common/guards/access-control.guard';
import { UsersService } from '../../core/users/users.service';
import { TasksService } from '../../core/tasks/tasks.service';
import { AccessControlList } from '../../common/decorators/access-control-list.decorator';
import { UserRole, UserStatus } from '../../common/types/user.types';
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
    console.log('query in controller:');
    console.dir(query);
    const { latitude, longitude, distance, ...data } = query;
    return this.tasksService.getTasksByStatus(TaskStatus.CREATED, {
      ...data,
      location: [longitude, latitude],
      distance,
    });
  }

  @AccessControlList({ role: UserRole.VOLUNTEER, level: UserStatus.CONFIRMED })
  @Put('tasks/:id/accept')
  public async accept(@Req() { user: { _id: volunteerId } }, @Param('id') taskId: string) {
    console.log(`taskId: '${taskId}'`);
    return this.tasksService.acceptTask(taskId, volunteerId);
  }

  @Put('/tasks/:id/fulfill')
  @AccessControlList({ role: UserRole.VOLUNTEER, level: UserStatus.CONFIRMED })
  public async fulfillTask(@Param('id') id: string, @Req() { user: { _id: userId } }) {
    console.log(`PUT /tasks/${id}/fulfill`);
    return this.tasksService.reportTask(id, userId, UserRole.VOLUNTEER, TaskReport.FULFILLED);
  }

  @Put('/tasks/:id/reject')
  @AccessControlList({ role: UserRole.VOLUNTEER, level: UserStatus.CONFIRMED })
  public async rejectTask(@Param('id') id: string, @Req() { user: { _id: userId } }) {
    return this.tasksService.reportTask(id, userId, UserRole.VOLUNTEER, TaskReport.REJECTED);
  }

  @Get('/tasks/accepted')
  @AccessControlList({ role: UserRole.VOLUNTEER, level: UserStatus.CONFIRMED })
  public async getAcceptedTasks(@Query() query: GetTasksSearchDto, @Req() { user }) {
    const { latitude, longitude, ...data } = query;
    return this.tasksService.getOwnTasks(user, TaskStatus.ACCEPTED, {
      ...data,
      location: [longitude, latitude],
    });
  }

  @Get('/tasks/completed')
  @AccessControlList({ role: UserRole.VOLUNTEER, level: UserStatus.CONFIRMED })
  public async getCompletedTasks(@Query() query: GetTasksSearchDto, @Req() { user }) {
    const { latitude, longitude, ...data } = query;
    return this.tasksService.getOwnTasks(user, TaskStatus.COMPLETED, {
      ...data,
      location: [longitude, latitude],
    });
  }
}
