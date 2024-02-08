import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { TasksService } from '../../core/tasks/tasks.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { AccessControlGuard } from '../../common/guards/access-control.guard';
import { ApiCreateTaskDto } from './dto/create-task.dto';
import { AccessControlList } from '../../common/decorators/access-control-list.decorator';
import { UserRole, UserStatus } from '../../common/types/user.types';

@UseGuards(JwtAuthGuard)
@UseGuards(AccessControlGuard)
@Controller('volunteer')
export class RecipientApiController {
  constructor(private readonly tasksService: TasksService) {}

  @Post('/tasks')
  @AccessControlList({ role: UserRole.RECIPIENT, level: UserStatus.CONFIRMED })
  async create(@Body() dto: ApiCreateTaskDto, @Req() { user: { _id: recipientId } }) {
    return this.tasksService.create({ ...dto, recipientId });
  }
}
