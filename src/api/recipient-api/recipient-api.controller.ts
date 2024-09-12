import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiOperation,
  ApiBody,
  ApiCreatedResponse,
  ApiBadRequestResponse,
  ApiUnauthorizedResponse,
  ApiForbiddenResponse,
  ApiQuery,
  ApiParam,
  ApiInternalServerErrorResponse,
  ApiConflictResponse,
  ApiTags,
} from '@nestjs/swagger';
import { TasksService } from '../../core/tasks/tasks.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { AccessControlGuard } from '../../common/guards/access-control.guard';
import { ApiCreateTaskDto } from './dto/create-task.dto';
import { CreatedTaskDto } from './dto/created-task.dto';
import { AccessControlList } from '../../common/decorators/access-control-list.decorator';
import { AnyUserInterface, UserRole, UserStatus } from '../../common/types/user.types';
import { GetTasksSearchDto } from './dto/get-tasks-query.dto';
import { TaskReport, TaskStatus } from '../../common/types/task.types';
import { DeletedTaskDto } from './dto/deleted-task.dto';

@UseGuards(JwtAuthGuard)
@UseGuards(AccessControlGuard)
@ApiTags('Recipient API')
@Controller('recipient')
export class RecipientApiController {
  constructor(private readonly tasksService: TasksService) {}

  @Post('/tasks')
  @AccessControlList({ role: UserRole.RECIPIENT, level: UserStatus.CONFIRMED })
  @ApiOperation({ summary: 'Создание задачи' })
  @ApiBody({ type: ApiCreateTaskDto })
  @ApiCreatedResponse({
    description: 'Задача создана успешно.',
    type: CreatedTaskDto,
  })
  @ApiBadRequestResponse({
    schema: {
      type: 'object',
      example: {
        message: ['string'],
        error: 'Bad Request',
        statusCode: 400,
      },
    },
    description: 'Произошла ошибка',
  })
  @ApiUnauthorizedResponse({
    schema: {
      type: 'object',
      example: {
        message: 'Unauthorized',
        statusCode: 401,
      },
    },
    description: 'Требуется авторизация',
  })
  @ApiForbiddenResponse({
    schema: {
      type: 'object',
      example: {
        message: 'Forbidden resource',
        error: 'Forbidden',
        statusCode: 403,
      },
    },
    description: 'Требуется другой статус',
  })
  @ApiInternalServerErrorResponse({
    schema: {
      type: 'object',
      example: {
        statusCode: 500,
        message: 'Internal server error',
      },
    },
    description: 'Внутрення ошибка на сервере',
  })
  public async create(@Body() dto: ApiCreateTaskDto, @Req() { user: { _id: recipientId } }) {
    return this.tasksService.create({ ...dto, recipientId });
  }

  @Get('/tasks/virgin')
  @ApiOperation({ summary: 'Найти все неразобранные задачи реципиента' })
  @ApiQuery({ type: GetTasksSearchDto })
  @ApiCreatedResponse({
    type: CreatedTaskDto,
    isArray: true,
  })
  @ApiUnauthorizedResponse({
    schema: {
      type: 'object',
      example: {
        message: 'Unauthorized',
        statusCode: 401,
      },
    },
    description: 'Требуется авторизация',
  })
  @ApiForbiddenResponse({
    schema: {
      type: 'object',
      example: {
        message: 'Forbidden resource',
        error: 'Forbidden',
        statusCode: 403,
      },
    },
    description: 'Требуется другой статус',
  })
  @ApiInternalServerErrorResponse({
    schema: {
      type: 'object',
      example: {
        statusCode: 500,
        message: 'Internal server error',
      },
    },
    description: 'Внутрення ошибка на сервере',
  })
  @AccessControlList({ role: UserRole.RECIPIENT, level: UserStatus.CONFIRMED })
  public async getVirginTasks(@Query() query: GetTasksSearchDto, @Req() req: Express.Request) {
    const { user } = req;
    return this.tasksService.getTasksByStatus(TaskStatus.CREATED, query, user as AnyUserInterface);
  }

  @Put('/tasks/:id/fulfill')
  @ApiOperation({ summary: 'Отметить задачу как выполненную' })
  @ApiParam({ name: 'id', type: 'string', description: 'ID задачи' })
  @ApiCreatedResponse({
    description: 'Задача отмечена как выполненная',
    type: CreatedTaskDto,
  })
  @ApiBadRequestResponse({
    schema: {
      type: 'object',
      example: {
        message: ['string'],
        error: 'Bad Request',
        statusCode: 400,
      },
    },
    description: 'Произошла ошибка',
  })
  @ApiUnauthorizedResponse({
    schema: {
      type: 'object',
      example: {
        message: 'Unauthorized',
        statusCode: 401,
      },
    },
    description: 'Требуется авторизация',
  })
  @ApiForbiddenResponse({
    schema: {
      type: 'object',
      example: {
        message: 'Forbidden resource',
        error: 'Forbidden',
        statusCode: 403,
      },
    },
    description: 'Требуется другой статус',
  })
  @ApiConflictResponse({
    schema: {
      type: 'object',
      example: {
        message: 'Нельзя повторно отчитаться по задаче!',
        statusCode: 409,
      },
    },
    description: 'Запрос конфликтует с текущим состоянием сервера',
  })
  @ApiInternalServerErrorResponse({
    schema: {
      type: 'object',
      example: {
        statusCode: 500,
        message: 'Internal server error',
      },
    },
    description: 'Внутрення ошибка на сервере',
  })
  @AccessControlList({ role: UserRole.RECIPIENT, level: UserStatus.CONFIRMED })
  public async fulfillTask(@Param('id') id: string, @Req() { user: { _id: userId } }) {
    return this.tasksService.reportTask(id, userId, UserRole.RECIPIENT, TaskReport.FULFILLED);
  }

  @Put('/tasks/:id/reject')
  @ApiOperation({ summary: 'Отклонение задачи реципиентом' })
  @ApiParam({ name: 'id', type: 'string', description: 'ID задачи' })
  @ApiCreatedResponse({
    description: 'Задача отмечена как отклоненная реципиентом',
    type: CreatedTaskDto,
  })
  @ApiBadRequestResponse({
    schema: {
      type: 'object',
      example: {
        message: ['string'],
        error: 'Bad Request',
        statusCode: 400,
      },
    },
    description: 'Произошла ошибка',
  })
  @ApiUnauthorizedResponse({
    schema: {
      type: 'object',
      example: {
        message: 'Unauthorized',
        statusCode: 401,
      },
    },
    description: 'Требуется авторизация',
  })
  @ApiForbiddenResponse({
    schema: {
      type: 'object',
      example: {
        message: 'Forbidden resource',
        error: 'Forbidden',
        statusCode: 403,
      },
    },
    description: 'Требуется другой статус',
  })
  @ApiConflictResponse({
    schema: {
      type: 'object',
      example: {
        message: 'Нельзя повторно отчитаться по задаче!',
        statusCode: 409,
      },
    },
    description: 'Запрос конфликтует с текущим состоянием сервера',
  })
  @ApiInternalServerErrorResponse({
    schema: {
      type: 'object',
      example: {
        statusCode: 500,
        message: 'Internal server error',
      },
    },
    description: 'Внутрення ошибка на сервере',
  })
  @AccessControlList({ role: UserRole.RECIPIENT, level: UserStatus.CONFIRMED })
  public async rejectTask(@Param('id') id: string, @Req() { user: { _id: userId } }) {
    return this.tasksService.reportTask(id, userId, UserRole.RECIPIENT, TaskReport.REJECTED);
  }

  @Get('/tasks/accepted')
  @ApiOperation({ summary: 'Найти все принятые задачи реципиента' })
  @ApiQuery({ type: GetTasksSearchDto })
  @ApiCreatedResponse({
    type: CreatedTaskDto,
    isArray: true,
  })
  @ApiUnauthorizedResponse({
    schema: {
      type: 'object',
      example: {
        message: 'Unauthorized',
        statusCode: 401,
      },
    },
    description: 'Требуется авторизация',
  })
  @ApiForbiddenResponse({
    schema: {
      type: 'object',
      example: {
        message: 'Forbidden resource',
        error: 'Forbidden',
        statusCode: 403,
      },
    },
    description: 'Требуется другой статус',
  })
  @AccessControlList({ role: UserRole.RECIPIENT, level: UserStatus.CONFIRMED })
  public async getAcceptedTasks(@Query() query: GetTasksSearchDto, @Req() req: Express.Request) {
    const { latitude, longitude, ...data } = query;
    return this.tasksService.getOwnTasks(req.user as AnyUserInterface, TaskStatus.ACCEPTED, {
      ...data,
      location: [longitude, latitude],
    });
  }

  @Get('/tasks/active')
  @ApiOperation({ summary: 'Найти все активные задачи реципиента' })
  @ApiQuery({ type: GetTasksSearchDto })
  @ApiCreatedResponse({
    type: CreatedTaskDto,
    isArray: true,
  })
  @ApiUnauthorizedResponse({
    schema: {
      type: 'object',
      example: {
        message: 'Unauthorized',
        statusCode: 401,
      },
    },
    description: 'Требуется авторизация',
  })
  @ApiForbiddenResponse({
    schema: {
      type: 'object',
      example: {
        message: 'Forbidden resource',
        error: 'Forbidden',
        statusCode: 403,
      },
    },
    description: 'Требуется другой статус',
  })
  @AccessControlList({ role: UserRole.RECIPIENT, level: UserStatus.CONFIRMED })
  public async getActiveTasks(@Query() query: GetTasksSearchDto, @Req() req: Express.Request) {
    const { latitude, longitude, ...data } = query;
    const accepted = await this.tasksService.getOwnTasks(
      req.user as AnyUserInterface,
      TaskStatus.ACCEPTED,
      {
        ...data,
        location: [longitude, latitude],
      }
    );
    const created = await this.tasksService.getOwnTasks(
      req.user as AnyUserInterface,
      TaskStatus.CREATED,
      {
        ...data,
        location: [longitude, latitude],
      }
    );
    return Promise.resolve([...created, ...accepted]);
  }

  @Get('/tasks/completed')
  @AccessControlList({ role: UserRole.RECIPIENT, level: UserStatus.CONFIRMED })
  @ApiOperation({ summary: 'Найти все завершенные задачи реципиента' })
  @ApiQuery({ type: GetTasksSearchDto })
  @ApiCreatedResponse({
    type: CreatedTaskDto,
    isArray: true,
  })
  @ApiUnauthorizedResponse({
    schema: {
      type: 'object',
      example: {
        message: 'Unauthorized',
        statusCode: 401,
      },
    },
    description: 'Требуется авторизация',
  })
  @ApiForbiddenResponse({
    schema: {
      type: 'object',
      example: {
        message: 'Forbidden resource',
        error: 'Forbidden',
        statusCode: 403,
      },
    },
    description: 'Требуется другой статус',
  })
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

  @Get('/tasks/:id')
  @ApiOperation({ summary: 'Найти задачу по ID' })
  @AccessControlList({ role: UserRole.RECIPIENT, level: UserStatus.CONFIRMED })
  @ApiParam({ name: 'id', type: 'string', description: 'ID задачи' })
  @ApiCreatedResponse({
    type: CreatedTaskDto,
  })
  @ApiUnauthorizedResponse({
    schema: {
      type: 'object',
      example: {
        message: 'Unauthorized',
        statusCode: 401,
      },
    },
    description: 'Требуется авторизация',
  })
  @ApiForbiddenResponse({
    schema: {
      type: 'object',
      example: {
        message: 'Forbidden resource',
        error: 'Forbidden',
        statusCode: 403,
      },
    },
    description: 'Требуется другой статус',
  })
  @ApiInternalServerErrorResponse({
    schema: {
      type: 'object',
      example: {
        statusCode: 500,
        message: 'Internal server error',
      },
    },
    description: 'Внутрення ошибка на сервере',
  })
  public async getTaskById(@Param('id') id: string) {
    return this.tasksService.getTask(id);
  }

  @Patch('/tasks/:id')
  @AccessControlList({ role: UserRole.RECIPIENT, level: UserStatus.CONFIRMED })
  @ApiOperation({ summary: 'Редактирование задачи' })
  @ApiBody({ type: ApiCreateTaskDto })
  @ApiParam({ name: 'id', type: 'string', description: 'ID задачи' })
  @ApiCreatedResponse({
    description: 'Задача отредактирована успешно.',
    type: CreatedTaskDto,
  })
  @ApiBadRequestResponse({
    schema: {
      type: 'object',
      example: {
        message: ['string'],
        error: 'Bad Request',
        statusCode: 400,
      },
    },
    description: 'Произошла ошибка',
  })
  @ApiUnauthorizedResponse({
    schema: {
      type: 'object',
      example: {
        message: 'Unauthorized',
        statusCode: 401,
      },
    },
    description: 'Требуется авторизация',
  })
  @ApiForbiddenResponse({
    schema: {
      type: 'object',
      example: {
        message: 'Forbidden resource',
        error: 'Forbidden',
        statusCode: 403,
      },
    },
    description: 'Требуется другой статус',
  })
  @ApiInternalServerErrorResponse({
    schema: {
      type: 'object',
      example: {
        statusCode: 500,
        message: 'Internal server error',
      },
    },
    description: 'Внутрення ошибка на сервере',
  })
  public async updateTask(
    @Param('id') id: string,
    @Req() { user },
    @Body() dto: Partial<ApiCreateTaskDto>
  ) {
    return this.tasksService.updateTask(id, user as AnyUserInterface, dto);
  }

  @Delete('/tasks/:id')
  @AccessControlList({ role: UserRole.RECIPIENT, level: UserStatus.CONFIRMED })
  @ApiOperation({ summary: 'Удаление задачи' })
  @ApiParam({ name: 'id', type: 'string', description: 'ID задачи' })
  @ApiCreatedResponse({
    description: 'Задача удалена успешно.',
    type: DeletedTaskDto,
  })
  @ApiUnauthorizedResponse({
    schema: {
      type: 'object',
      example: {
        message: 'Unauthorized',
        statusCode: 401,
      },
    },
    description: 'Требуется авторизация',
  })
  @ApiForbiddenResponse({
    schema: {
      type: 'object',
      example: {
        message: 'Forbidden resource',
        error: 'Forbidden',
        statusCode: 403,
      },
    },
    description: 'Требуется другой статус',
  })
  @ApiInternalServerErrorResponse({
    schema: {
      type: 'object',
      example: {
        statusCode: 500,
        message: 'Internal server error',
      },
    },
    description: 'Внутрення ошибка на сервере',
  })
  public async cancelTask(@Param('id') id: string, @Req() req: Express.Request) {
    const { user } = req;
    return this.tasksService.cancelTask(id, user as AnyUserInterface);
  }
}
