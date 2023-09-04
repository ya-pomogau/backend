import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  InternalServerErrorException,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { ObjectId } from 'mongodb';
import {
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

import { User } from './entities/user.entity';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { ChangeStatusDto } from './dto/change-status.dto';
import { ChangeAdminPermissionsDto } from './dto/change-adminPermissions.dto';
import { CreateAdminDto } from './dto/create-admin.dto';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { CreateUserDto } from './dto/create-user.dto';
import { UserRolesGuard } from '../auth/guards/user-roles.guard';
import { AdminPermissionsGuard } from '../auth/guards/admin-permissions.guard';
import { UserRoles } from '../auth/decorators/user-roles.decorator';
import { AdminPermission, EUserRole } from './types';
import { AdminPermissions } from '../auth/decorators/admin-permissions.decorator';
import { AuthUser } from '../auth/decorators/auth-user.decorator';
import { ApiUnauthorized } from '../auth/types/unauthorized';
import exceptions from '../common/constants/exceptions';
import { Task } from '../tasks/entities/task.entity';
import { UserQueryDto } from './dto/user-query.dto';

@ApiBearerAuth()
@ApiTags('Users')
@UseGuards(JwtGuard)
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({
    summary: 'Список всех пользователей',
    description: 'Доступ только для администраторов',
  })
  @ApiOkResponse({
    status: 200,
    type: User,
    isArray: true,
  })
  @ApiForbiddenResponse({
    status: 403,
    description: exceptions.users.onlyForAdmins,
  })
  @UseGuards(UserRolesGuard)
  @UserRoles(EUserRole.ADMIN, EUserRole.MASTER)
  @Get()
  async findAll(): Promise<Omit<User, 'login' | 'password'>[]> {
    try {
      return await this.userService.findAll();
    } catch (error) {
      console.error('Ошибка при получении данных пользователей:', error);
      throw new InternalServerErrorException('Произошла ошибка при получении данных пользователей');
    }
  }

  @ApiOperation({
    summary: 'Поиск пользователей по параметрам',
    description: 'Доступ только для администраторов',
  })
  @ApiQuery({ type: UserQueryDto })
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
  async findBy(@Query() query: object): Promise<User[]> {
    return this.userService.findBy(query);
  }

  @ApiOperation({
    summary: 'Создание администратора',
    description:
      'Доступ только для главного администратора. Администраторы создаются со статусом 3 (максимальный). Права устанавливаются в массиве permissions - все доступные перечислены в примере.',
  })
  @ApiUnauthorizedResponse({
    type: ApiUnauthorized,
  })
  @ApiOkResponse({
    status: 200,
    type: User,
  })
  @ApiForbiddenResponse({
    status: 403,
    description: exceptions.users.onlyForMaster,
  })
  @UseGuards(UserRolesGuard)
  @UserRoles(EUserRole.MASTER)
  @Post('admin')
  async createAdmin(@Body() userData: CreateAdminDto): Promise<User> {
    try {
      return await this.userService.createAdmin(userData);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @ApiOperation({
    summary: 'Создание реципиента/волонтера (только для тестов, в проде регистрация через вк!)',
  })
  @ApiOkResponse({
    status: 200,
    type: User,
  })
  @Post()
  async createUser(@Body() userData: CreateUserDto): Promise<User> {
    try {
      return await this.userService.createUser(userData);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @ApiOperation({
    summary: 'Данные о текущем авторизованном пользователе',
  })
  @ApiOkResponse({
    status: 200,
    type: User,
  })
  @Get('own')
  async getOwnUser(@AuthUser() user: User): Promise<Omit<User, 'login'> | undefined> {
    try {
      return await this.userService.findUserById(user._id.toString());
    } catch (error) {
      console.error('Ошибка при получении информации о пользователе:', error);
      throw new InternalServerErrorException(
        'Произошла ошибка при получении информации о пользователе'
      );
    }
  }

  @ApiOperation({
    summary: 'Поиск пользователя по id',
  })
  @ApiOkResponse({
    status: 200,
    type: User,
  })
  @Get(':id')
  async getUserById(@Param('id') id: string): Promise<Omit<User, 'login'>> {
    return this.userService.findUserById(id);
  }

  @ApiOperation({
    summary: 'Удаление пользователя по id',
    description: 'Доступ только для администраторов с соответствующими правами',
  })
  @ApiForbiddenResponse({
    status: 403,
    description: exceptions.users.onlyForAdmins,
  })
  @UseGuards(UserRolesGuard, AdminPermissionsGuard)
  @UserRoles(EUserRole.ADMIN, EUserRole.MASTER)
  @AdminPermissions(AdminPermission.CONFIRMATION)
  @Delete(':id')
  async deleteUser(@Param('id') id: string): Promise<void> {
    const objectId = new ObjectId(id);
    await this.userService.deleteUserById(objectId);
  }

  @ApiOperation({
    summary: 'Редактирование пользователя по id',
    description: 'Для редактирования доступны только поля, заполняемые при регистрации + аватар',
  })
  @ApiOkResponse({
    status: 200,
    type: User,
  })
  @Patch(':id')
  async updateUser(
    @Param('id') id: string,
    @Body(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
    updateUserDto: UpdateUserDto
  ): Promise<User> {
    try {
      return this.userService.updateOne(id, updateUserDto);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @ApiOperation({
    summary: 'Изменение статуса пользователя 0 до 2',
    description:
      'Доступ только для администраторов с соответствующими правами. Доступные статусы: 0 - не подтвержден, 1 - подтвержден, 2 - подтвержден и проверен. Увеличение статуса до 3 (активирован ключ) доступно только по пути /key.',
  })
  @ApiOkResponse({
    status: 200,
    type: User,
  })
  @ApiForbiddenResponse({
    status: 403,
    description: exceptions.users.onlyForAdmins,
  })
  @UseGuards(UserRolesGuard, AdminPermissionsGuard)
  @UserRoles(EUserRole.ADMIN, EUserRole.MASTER)
  @AdminPermissions(AdminPermission.CONFIRMATION)
  @Patch(':id/status')
  async changeStatus(
    @Param('id') id: string,
    @Body(new ValidationPipe()) changeStatusDto: ChangeStatusDto
  ): Promise<Omit<User, 'login'>> {
    return this.userService.changeStatus(id, changeStatusDto.status);
  }

  @ApiOperation({
    summary: 'Изменение статуса пользователя до 3 (активирован ключ)',
    description:
      'Доступ только для администраторов с соответствующими правами. Для изменения статусов от 0 до 2 используйте путь /status.',
  })
  @ApiOkResponse({
    status: 200,
    type: User,
  })
  @ApiForbiddenResponse({
    status: 403,
    description: exceptions.users.onlyForAdmins,
  })
  @UseGuards(UserRolesGuard, AdminPermissionsGuard)
  @UserRoles(EUserRole.ADMIN, EUserRole.MASTER)
  @AdminPermissions(AdminPermission.KEYS)
  @Patch(':id/key')
  async giveKey(@Param('id') id: string): Promise<Omit<User, 'login'>> {
    return this.userService.giveKey(id);
  }

  @ApiOperation({
    summary: 'Редактирование прав администраторов',
    description:
      'Доступ только для главного администратора. Необходимо передать полный массив обновленных прав.',
  })
  @ApiOkResponse({
    status: 200,
    type: User,
  })
  @ApiForbiddenResponse({
    status: 403,
    description: exceptions.users.onlyForMaster,
  })
  @UseGuards(UserRolesGuard)
  @UserRoles(EUserRole.MASTER)
  @Patch(':id/admin-permissions')
  async changeAdminPermissions(
    @Param('id') id: string,
    @Body() changeAdminPermissionsDto: ChangeAdminPermissionsDto
  ): Promise<Omit<User, 'login'>> {
    return this.userService.changeAdminPermissions(id, changeAdminPermissionsDto.permissions);
  }

  @ApiOperation({
    summary: 'Блокировка/разблокировка пользователя',
    description: 'Доступ только для администраторов с соответствующими правами',
  })
  @ApiOkResponse({
    status: 200,
    type: User,
  })
  @ApiForbiddenResponse({
    status: 403,
    description: exceptions.users.onlyForAdmins,
  })
  @UseGuards(UserRolesGuard, AdminPermissionsGuard)
  @UserRoles(EUserRole.ADMIN, EUserRole.MASTER)
  @AdminPermissions(AdminPermission.CONFIRMATION)
  @Patch(':id/block')
  async blockUser(@Param('id') id: string): Promise<Omit<User, 'login'>> {
    return this.userService.blockUser(id);
  }
}
