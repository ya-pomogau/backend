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
import { ObjectId } from 'mongodb';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { User } from '../users/entities/user.entity';
import { ConfirmTaskDto } from './dto/confirm-task.dto';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  create(@Body(new ValidationPipe()) createTaskDto: CreateTaskDto) {
    return this.tasksService.create(createTaskDto, 1);
  }

  @Get('find')
  async findBy(@Query() query: object) {
    return this.tasksService.findBy(query);
  }

  // нужна авторизация для execution context
  // @Get(':recipientId/find')
  // async findRecipientTasksByStatus(
  //   @Query('status') statusList: string,
  //   @Param('recipientId') recipientId: string
  // ) {
  //   return this.tasksService.findBy(statusList, recipientId);
  // }
  //
  // @Get(':volunteer/find')
  // async findVolunteerTasksByStatus(
  //   @Query('status') statusList: string,
  //   @Param('volunteerId') volunteerId: string
  // ) {
  //   return this.tasksService.findBy(statusList, volunteerId);
  // }

  @Get()
  async findAll() {
    return this.tasksService.findAll();
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    return this.tasksService.findById(id);
  }

  @Patch('accept/:taskId')
  async acceptTask(
    @Param('taskId') taskId: string,
    @Body(new ValidationPipe()) updateTaskDto: UpdateTaskDto
  ) {
    const { volunteerId } = updateTaskDto;
    return this.tasksService.acceptTask(taskId, volunteerId);
  }

  @Patch('refuse/:id')
  async refuseTask(@Param('id') id: string) {
    const isAdmin = true; // заменить на данные авторизованного пользователя
    return this.tasksService.refuseTask(id, isAdmin);
  }

  @Delete(':id')
  async deleteTask(@Param('id') id: string) {
    const isAdmin = true; // заменить на данные авторизованного пользователя
    return this.tasksService.removeTask(id, isAdmin);
  }

  // закрыть гардой админа
  @Patch('close/:id')
  async closeTask(@Param('id') id: string, @Query('completed') completed: boolean) {
    return this.tasksService.closeTask(id, completed);
  }

  // прокинуть авторизованного юзера
  @Patch('confirm/:taskId')
  async confirmTask(
    @Param('taskId') taskId: string,
    @Body(new ValidationPipe()) confirmTaskDto: ConfirmTaskDto
  ) {
    return this.tasksService.confirmTask(
      taskId,
      '64d50cf327100110922f75e3',
      confirmTaskDto.completed
    );
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateTaskDto: UpdateTaskDto) {
    return this.tasksService.update(id, updateTaskDto);
  }
}
