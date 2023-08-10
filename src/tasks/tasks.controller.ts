import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ValidationPipe,
  Query,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { User } from '../users/entities/user.entity';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  create(@Body(new ValidationPipe()) createTaskDto: CreateTaskDto, ownUser: User) {
    return this.tasksService.create(createTaskDto, ownUser);
  }

  @Get('find')
  async findAllByStatus(@Query('status') statusList: string) {
    return this.tasksService.findByStatus(statusList);
  }

  @Get(':recipientId/find')
  async findRecipientTasksByStatus(
    @Query('status') statusList: string,
    @Param('recipientId') recipientId: string
  ) {
    return this.tasksService.findByStatus(statusList, recipientId);
  }

  @Get(':volunteer/find')
  async findVolunteerTasksByStatus(
    @Query('status') statusList: string,
    @Param('volunteerId') volunteerId: string
  ) {
    return this.tasksService.findByStatus(statusList, volunteerId);
  }

  @Get()
  findAll() {
    return this.tasksService.findAll();
  }

  @Get(':id')
  findById(@Param('id') id: string) {
    return this.tasksService.findById(id);
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateTaskDto: UpdateTaskDto) {
  //   return this.tasksService.update(+id, updateTaskDto);
  // }
  //
  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.tasksService.remove(+id);
  // }
}
