import * as fs from 'fs';
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
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  ValidationPipe,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

import { FileInterceptor } from '@nestjs/platform-express';
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
import exceptions from '../../src/common/constants/exceptions';
import { Task } from '../tasks/entities/task.entity';
import { UserQueryDto } from './dto/user-query.dto';
import { GenerateReportDto } from './dto/generate-report.dto';
import { BypassAuth } from '../auth/decorators/bypass-auth.decorator';
import { multerOptions, uploadType } from '../../src/config/multer-config';
import configuration from '../../src/config/configuration';

@ApiBearerAuth()
@ApiTags('Users')
@UseGuards(JwtGuard)
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({
    summary: 'Создание администратора',
    description:
      'Доступ только для главного администратора. Администраторы создаются со статусом 3 (максимальный). Права устанавливаются в массиве permissions - все доступные перечислены в примере.',
  })
  @ApiUnauthorizedResponse({
    type: ApiUnauthorized,
  })
  @ApiOkResponse({
    status: HttpStatus.OK,
    type: User,
  })
  @ApiForbiddenResponse({
    status: HttpStatus.FORBIDDEN,
    description: exceptions.users.onlyForMaster,
  })
  // @UseGuards(UserRolesGuard)
  // @UserRoles(EUserRole.MASTER)
  @BypassAuth() // убрать в проде!!!
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
    status: HttpStatus.OK,
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
    summary: 'Поиск пользователей по параметрам',
    description: 'Доступ только для администраторов',
  })
  @ApiQuery({ type: UserQueryDto })
  @ApiOkResponse({
    status: HttpStatus.OK,
    type: Task,
    isArray: true,
  })
  @ApiForbiddenResponse({
    status: HttpStatus.FORBIDDEN,
    description: exceptions.users.onlyForAdmins,
  })
  @UseGuards(UserRolesGuard)
  @UserRoles(EUserRole.ADMIN, EUserRole.MASTER)
  @Get('find')
  async findBy(@Query() query: object): Promise<User[]> {
    return this.userService.findBy(query);
  }

  @ApiOperation({
    summary: 'Получение загруженного аватара по ссылке',
  })
  @ApiParam({
    name: 'id',
    description: 'id пользователя, строка из 24 шестнадцатеричных символов',
    type: String,
  })
  @BypassAuth()
  @Get(':id/avatar')
  async getAvatar(@Param('id') id: string, @Res() res) {
    const image = `${configuration().avatars.dest}/${id}-avatar.jpg`;
    return res.sendFile(image);
  }

  @ApiOperation({
    summary: 'Данные о текущем авторизованном пользователе',
  })
  @ApiOkResponse({
    status: HttpStatus.OK,
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
    summary: 'Список пользователей для отчета',
    description:
      'Доступ только для администраторов' +
      '<br> Отсчет дняй активности ведётся от текущих даты и ВРЕМЕНИ минус 30 суток',
  })
  @ApiOkResponse({
    status: HttpStatus.OK,
    type: User,
    isArray: true,
  })
  @ApiForbiddenResponse({
    status: HttpStatus.FORBIDDEN,
    description: exceptions.users.onlyForAdmins,
  })
  @UseGuards(UserRolesGuard)
  @UserRoles(EUserRole.ADMIN, EUserRole.MASTER)
  @Get('report')
  async generateReport(@Query() generateReportDto: GenerateReportDto) {
    return this.userService.generateReport(generateReportDto);
  }

  @ApiOperation({
    summary: 'Список всех пользователей',
    description: 'Доступ только для администраторов',
  })
  @ApiOkResponse({
    status: HttpStatus.OK,
    type: User,
    isArray: true,
  })
  @ApiForbiddenResponse({
    status: HttpStatus.FORBIDDEN,
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
    summary: 'Поиск пользователя по id',
  })
  @ApiOkResponse({
    status: HttpStatus.OK,
    type: User,
  })
  @ApiParam({ name: 'id', description: 'строка из 24 шестнадцатеричных символов', type: String })
  @Get(':id')
  async getUserById(@Param('id') id: string): Promise<Omit<User, 'login'>> {
    return this.userService.findUserById(id);
  }

  @ApiOperation({
    summary: 'Удаление пользователя по id',
    description: 'Доступ только для администраторов с соответствующими правами',
  })
  @ApiForbiddenResponse({
    status: HttpStatus.FORBIDDEN,
    description: exceptions.users.onlyForAdmins,
  })
  @UseGuards(UserRolesGuard, AdminPermissionsGuard)
  @UserRoles(EUserRole.ADMIN, EUserRole.MASTER)
  @AdminPermissions(AdminPermission.CONFIRMATION)
  @Delete(':id')
  async deleteUser(@Param('id') id: string): Promise<void> {
    await this.userService.deleteUserById(id);
  }

  @ApiOperation({
    summary: 'Загрузка аватара с локального ПК',
    description:
      'Для загрузки необходимо передать файл в формате jpg/jpeg/png/gif. Файл будет сохранен в формате jpg.',
  })
  @ApiOkResponse({
    status: HttpStatus.OK,
    type: User,
  })
  @Patch('upload-avatar')
  @UseInterceptors(FileInterceptor('file', multerOptions(uploadType.AVATARS)))
  async upload(@AuthUser() user: User, @UploadedFile() file) {
    try {
      await fs.promises.mkdir(`${file.destination}`, { recursive: true });
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    const userPath = `${file.destination}/${user._id}-avatar.jpg`;

    try {
      await fs.rename(file.path, userPath, function (err) {
        if (err) {
          return console.error(err);
        }

        return null;
      });
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    return this.userService.updateOne(user._id.toString(), {
      avatar: `${configuration().server.http_address}/users/${user._id.toString()}/avatar`,
    });
  }

  @ApiOperation({
    summary: 'Редактирование пользователя по id',
    description: 'Для редактирования доступны только поля, заполняемые при регистрации + аватар',
  })
  @ApiOkResponse({
    status: HttpStatus.OK,
    type: User,
  })
  @ApiParam({ name: 'id', description: 'строка из 24 шестнадцатеричных символов', type: String })
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
    status: HttpStatus.OK,
    type: User,
  })
  @ApiForbiddenResponse({
    status: HttpStatus.FORBIDDEN,
    description: exceptions.users.onlyForAdmins,
  })
  @ApiParam({ name: 'id', description: 'строка из 24 шестнадцатеричных символов', type: String })
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
    status: HttpStatus.OK,
    type: User,
  })
  @ApiForbiddenResponse({
    status: HttpStatus.FORBIDDEN,
    description: exceptions.users.onlyForAdmins,
  })
  @ApiParam({ name: 'id', description: 'строка из 24 шестнадцатеричных символов', type: String })
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
    status: HttpStatus.OK,
    type: User,
  })
  @ApiForbiddenResponse({
    status: HttpStatus.FORBIDDEN,
    description: exceptions.users.onlyForMaster,
  })
  @ApiParam({ name: 'id', description: 'строка из 24 шестнадцатеричных символов', type: String })
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
    status: HttpStatus.OK,
    type: User,
  })
  @ApiForbiddenResponse({
    status: HttpStatus.FORBIDDEN,
    description: exceptions.users.onlyForAdmins,
  })
  @ApiParam({ name: 'id', description: 'строка из 24 шестнадцатеричных символов', type: String })
  @UseGuards(UserRolesGuard, AdminPermissionsGuard)
  @UserRoles(EUserRole.ADMIN, EUserRole.MASTER)
  @AdminPermissions(AdminPermission.CONFIRMATION)
  @Patch(':id/block')
  async blockUser(@Param('id') id: string): Promise<Omit<User, 'login'>> {
    return this.userService.blockUser(id);
  }
}
