import { Controller, Get, Param, Put, Query, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { AccessControlGuard } from '../../common/guards/access-control.guard';
import { UsersService } from '../../core/users/users.service';
import { TasksService } from '../../core/tasks/tasks.service';
import { AccessControlList } from '../../common/decorators/access-control-list.decorator';
import { UserRole, UserStatus } from '../../common/types/user.types';
import { GetTasksSearchDto } from '../recipient-api/dto/get-tasks-query.dto';

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
    return this.tasksService.getNotAcceptedTasks(query);
  }

  @AccessControlList({ role: UserRole.VOLUNTEER, level: UserStatus.CONFIRMED })
  @Put('tasks/:id/accept')
  public async accept(@Req() { user: { _id: volunteerId } }, @Param(':id') taskId: string) {
    return this.tasksService.acceptTask(taskId, volunteerId);
  }
}
