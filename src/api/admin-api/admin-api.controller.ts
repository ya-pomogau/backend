import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Req,
  Request,
  UseGuards,
} from '@nestjs/common';
import { MethodNotAllowedException } from '@nestjs/common/exceptions';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { UsersService } from '../../core/users/users.service';
import { BlogService } from '../../core/blog/blog.service';
import { CategoriesService } from '../../core/categories/categories.service';
import { ContactsService } from '../../core/contacts/contacts.service';
import { TasksService } from '../../core/tasks/tasks.service';
import { AccessControlGuard } from '../../common/guards/access-control.guard';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { AccessControlList } from '../../common/decorators/access-control-list.decorator';
import { AnyUserInterface, UserRole } from '../../common/types/user.types';
import { AccessRights } from '../../common/types/access-rights.types';
import { ResolveResult, TaskInterface, TaskStatus } from '../../common/types/task.types';
import { UpdateContactsRequestDto } from '../../common/dto/contacts.dto';
import { NewAdminDto } from './dto/new-admin.dto';
import { AdministratorDto } from './dto/administrator.dto';
import { PostDTO } from './dto/new-post.dto';
import { ApiPrivilegesDto } from './dto/privileges.dto';
import { ApiCreateCategoryDto } from './dto/new-category.dto';
import { ApiUpdateCategoryDto } from './dto/update-category.dto';
import { ApiBulkUpdateCategoriesDto } from './dto/bulk-update-categories.dto';
import { CreateUserDto } from 'src/common/dto/users.dto';
import { UserDto } from './dto/user.dto';
import { CreatedPostDto } from './dto/created-post.dto';
import { CreatedCategoryDto } from './dto/created-category.dto';
import { ConflictedTasksDto } from './dto/conflicted-task.dto';
import { TaskDto } from './dto/created-task.dto';
import { ContactInfoDto } from './dto/contact.dto';

@UseGuards(JwtAuthGuard)
@UseGuards(AccessControlGuard)
@Controller('admin')
@ApiTags('Administrative API. Guarded.')
export class AdminApiController {
  constructor(
    private readonly usersService: UsersService,
    private readonly blogService: BlogService,
    private readonly categoryService: CategoriesService,
    private readonly tasksService: TasksService,
    private readonly contactsService: ContactsService
  ) {}

  @Get('all')
  // @ApiTags('Get a list of administrators')
  @ApiOperation({
    summary: 'Получает список всех пользователей-администраторов',
    description:
      'Получает список всех активированных пользователей-администраторов в системе (не включает главного администратора)',
  })
  @ApiBearerAuth()
  @ApiUnauthorizedResponse({
    description: 'Отсутствуют необходимые полномочия для выполнения данной операции',
  })
  @ApiBadRequestResponse({
    description: 'Некорректный запрос',
  })
  @ApiResponse({
    status: 200,
    description: 'Ok',
    type: [AdministratorDto],
  })
  @AccessControlList({ role: UserRole.ADMIN, rights: [AccessRights.confirmUser] })
  public async getAdministrators() {
    return this.usersService.getAdministrators();
  }

  @Post('create')
  // @ApiTags('Create an administrative user. Root only.')
  @ApiOperation({
    summary: 'Создает нового администратора',
    description:
      'Создает нового пользователя с полномочиями администратора (не главный администратор)',
  })
  @ApiBody({ type: NewAdminDto })
  @ApiCreatedResponse({
    description: 'Ok',
    type: AdministratorDto,
  })
  @ApiBearerAuth()
  @ApiUnauthorizedResponse({
    description: 'Отсутствуют необходимые полномочия для выполнения данной операции',
  })
  @ApiBadRequestResponse({ description: 'Некорректный запрос' })
  @AccessControlList({ role: UserRole.ADMIN, isRoot: true })
  async create(@Body() dto: NewAdminDto) {
    return this.usersService.createAdmin({
      role: UserRole.ADMIN,
      ...dto,
      permissions: [],
      isRoot: false,
    });
  }

  @Put(':id/activate')
  // @ApiTags('Activate an administrator. Root only.')
  @ApiOperation({
    summary: 'Активирует администратора',
    description: 'Активирует администратора',
  })
  @ApiParam({
    name: 'id',
    description: 'Идентификатор администратора',
    type: 'string',
    example: '66e00d39886d5b0bae564611',
    required: true,
  })
  @ApiResponse({
    status: 200,
    type: AdministratorDto,
    description: 'Возвращает объект администратора с обновленным значением isActive = true',
  })
  @ApiUnauthorizedResponse({
    description: 'Отсутствуют необходимые полномочия для выполнения данной операции',
  })
  @ApiBadRequestResponse({ description: 'Некорректный запрос' })
  @AccessControlList({ role: UserRole.ADMIN, isRoot: true })
  async activate(@Param('id') _id: string) {
    return this.usersService.activate(_id);
  }

  @Delete(':id/activate')
  // @ApiTags('Block (deactivate) an administrator. Root only.')
  @ApiOperation({
    summary: 'Блокирует администратора',
    description: 'Блокирует администратора',
  })
  @ApiParam({
    name: 'id',
    description: 'Идентификатор администратора',
    type: 'string',
    example: '66e00d39886d5b0bae564611',
    required: true,
  })
  @ApiResponse({
    status: 200,
    type: AdministratorDto,
    description: 'Возвращает объект администратора с обновленным значением isActive = false',
  })
  @ApiUnauthorizedResponse({
    description: 'Отсутствуют необходимые полномочия для выполнения данной операции',
  })
  @ApiBadRequestResponse({ description: 'Некорректный запрос' })
  @AccessControlList({ role: UserRole.ADMIN, isRoot: true })
  async deactivate(@Param('id') _id: string) {
    return this.usersService.deactivate(_id);
  }

  // Добавление привилегий администратору. Только root
  @Put(':id/privileges')
  // @ApiTags('Grant administrator privileges. Root only.')
  @ApiOperation({
    summary: 'Добавляет привилегий администратору',
    description:
      'Добавляет привилегий администратору. У каждого администратора есть шесть видов прав доступа: “Подтверждать аккаунты”, “Создавать заявки”, “Выдавать ключи”, “Решать споры”, “Контент блог”, “Повышение баллов”. Они не зависят друг от друга и могут использоваться в разных комбинациях. Только для главного администратора!',
  })
  @ApiParam({
    name: 'id',
    description: 'Идентификатор администратора',
    type: 'string',
    example: '66e00d39886d5b0bae564611',
    required: true,
  })
  @ApiBody({ type: ApiPrivilegesDto })
  @ApiResponse({
    status: 200,
    type: AdministratorDto,
    description: 'Возвращает объект администратора с обновленным значением permissions (массив с перечислением полномочий)',
  })
  @ApiUnauthorizedResponse({
    description: 'Отсутствуют необходимые полномочия для выполнения данной операции',
  })
  @ApiBadRequestResponse({ description: 'Некорректный запрос' })
  @AccessControlList({ role: UserRole.ADMIN, isRoot: true })
  public async grantPrivileges(
    @Param('id') userId,
    @Body() dto: ApiPrivilegesDto,
    @Req() req: Express.Request
  ) {
    const { privileges } = dto;
    return this.usersService.grantPrivileges(req.user as AnyUserInterface, userId, privileges);
  }

  // Удаление привилегий администратора. Только root
  @Delete(':id/privileges')
  // @ApiTags('Revoke administrator privileges. Root only.')
  @ApiOperation({
    summary: 'Удаляет привилегии у администратора',
    description: 'Удаляет привилегии у администратора. Только для главного администратора!',
  })
  @ApiParam({
    name: 'id',
    description: 'Идентификатор администратора',
    type: 'string',
    example: '66e00d39886d5b0bae564611',
    required: true,
  })
  @ApiBody({ type: ApiPrivilegesDto })
  @ApiResponse({
    status: 200,
    type: AdministratorDto,
    description: 'Возвращает объект администратора с обновленным значением permissions (массив с перечислением полномочий)',
  })
  @ApiUnauthorizedResponse({
    description: 'Отсутствуют необходимые полномочия для выполнения данной операции',
  })
  @ApiBadRequestResponse({ description: 'Некорректный запрос' })
  @AccessControlList({ role: UserRole.ADMIN, isRoot: true })
  public async revokePrivileges(
    @Param('id') userId,
    @Body() dto: ApiPrivilegesDto,
    @Req() req: Express.Request
  ) {
    const { privileges } = dto;
    return this.usersService.revokePrivileges(req.user as AnyUserInterface, userId, privileges);
  }

  // Обновление привилегий администратора. Только root
  @Patch(':id/privileges')
  // @ApiTags('Update administrator privileges. Root only.')
  @ApiOperation({
    summary: 'Обновляет привилегии администратора',
    description: 'Обновляет привилегии администратора. Только для главного администратора!',
  })
  @ApiParam({
    name: 'id',
    description: 'Идентификатор администратора',
    type: 'string',
    example: '66e00d39886d5b0bae564611',
    required: true,
  })
  @ApiBody({ type: ApiPrivilegesDto })
  @ApiResponse({
    status: 200,
    type: AdministratorDto,
    description: 'Возвращает объект администратора с обновленным значением permissions (массив с перечислением полномочий)',
  })
  @ApiUnauthorizedResponse({
    description: 'Отсутствуют необходимые полномочия для выполнения данной операции',
  })
  @ApiBadRequestResponse({ description: 'Некорректный запрос' })
  @AccessControlList({ role: UserRole.ADMIN, isRoot: true })
  public async updatePrivileges(
    @Param('id') userId,
    @Body() dto: ApiPrivilegesDto,
    @Req() req: Express.Request
  ) {
    const { privileges } = dto;
    return this.usersService.updatePrivileges(req.user as AnyUserInterface, userId, privileges);
  }

  @Put('users/:id/confirm')
  // @ApiTags('Confirm regular user. Limited access.')
  @ApiOperation({ summary: 'Подтверждает пользователя' })
  @ApiOperation({ description: 'Подтверждает пользователя' })
  @ApiParam({
    name: 'id',
    description: 'Идентификатор пользователя',
    type: 'string',
    example: '66e00d39886d5b0bae564611',
    required: true,
  })
  @ApiResponse({
    status: 200,
    type: UserDto,
    description: 'Возвращает объект пользователя со значением Status = 1 (CONFIRMED) ',
  })
  @ApiUnauthorizedResponse({
    description: 'Отсутствуют необходимые полномочия для выполнения данной операции',
  })
  @ApiBadRequestResponse({ description: 'Некорректный запрос' })
  @AccessControlList({ role: UserRole.ADMIN, rights: [AccessRights.confirmUser] })
  async confirm(@Param('id') _id: string) {
    return this.usersService.confirm(_id);
  }

  @Delete('users/:id/confirm')
  // @ApiTags('Block regular user. Limited access.')
  @ApiOperation({ summary: 'Блокирует пользователя' })
  @ApiOperation({ description: 'Блокирует пользователя' })
  @ApiParam({
    name: 'id',
    description: 'Идентификатор пользователя',
    type: 'string',
    example: '66e00d39886d5b0bae564611',
    required: true,
  })
  @ApiResponse({
    status: 200,
    type: UserDto,
    description: 'Возвращает объект пользователя со значением Status = -1 (BLOCKED)',
  })
  @ApiUnauthorizedResponse({
    description: 'Отсутствуют необходимые полномочия для выполнения данной операции',
  })
  @ApiBadRequestResponse({ description: 'Некорректный запрос' })
  @AccessControlList({ role: UserRole.ADMIN, rights: [AccessRights.blockUser] })
  async block(@Param('id') _id: string) {
    return this.usersService.block(_id);
  }

  @Put('users/:id/promote')
  // @ApiTags('Promote regular user (raise status). Limited access.')
  @ApiOperation({ summary: 'Разблокирует пользователя' })
  @ApiOperation({ description: 'Разблокирует пользователя' })
  @ApiParam({
    name: 'id',
    description: 'Идентификатор пользователя',
    type: 'string',
    example: '66e00d39886d5b0bae564611',
    required: true,
  })
  @ApiUnauthorizedResponse({
    description: 'Отсутствуют необходимые полномочия для выполнения данной операции',
  })
  @ApiResponse({
    status: 200,
    type: UserDto,
    description: 'Возвращает объект пользователя со значением Status = 0 (UNCONFIRMED)',
  })
  @ApiBadRequestResponse({ description: 'Некорректный запрос' })
  @AccessControlList({ role: UserRole.ADMIN, rights: [AccessRights.promoteUser] })
  async upgrade(@Param('id') _id: string) {
    return this.usersService.upgrade(_id);
  }

  @Delete('users/:id/promote')
  // @ApiTags('Downgrade regular user (lower status). Limited access.')
  @ApiOperation({ summary: 'Обновляет (понижает) статус пользователя' })
  @ApiOperation({ description: 'Обновляет (понижает) статус пользователя' })
  @ApiParam({
    name: 'id',
    description: 'Идентификатор пользователя',
    type: 'string',
    example: '66e00d39886d5b0bae564611',
    required: true,
  })
  @ApiResponse({
    status: 200,
    type: UserDto,
    description: 'Возвращает объект пользователя со значением Status = -1',
  })
  @ApiUnauthorizedResponse({
    description: 'Отсутствуют необходимые полномочия для выполнения данной операции',
  })
  @ApiBadRequestResponse({ description: 'Некорректный запрос' })
  @AccessControlList({ role: UserRole.ADMIN, isRoot: true })
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async downgrade(@Param('id') _id: string) {
    throw new MethodNotAllowedException('Этот метод нельзя использовать здесь!');
    // return this.usersService.downgrade(_id);
  }

  @Put('users/:id/keys')
  // @ApiTags('Grant keys to regular user. Limited access.')
  @ApiOperation({ summary: 'Выдает ключи пользователю' })
  @ApiOperation({ description: 'Выдает ключи пользователю' })
  @ApiParam({
    name: 'id',
    description: 'Идентификатор пользователя',
    type: 'string',
    example: '66e00d39886d5b0bae564611',
    required: true,
  })
  @ApiResponse({
    status: 200,
    type: UserDto,
    description: 'Возвращает объект пользователя',
  })
  @ApiUnauthorizedResponse({
    description: 'Отсутствуют необходимые полномочия для выполнения данной операции',
  })
  @ApiBadRequestResponse({ description: 'Некорректный запрос' })
  @AccessControlList({ role: UserRole.ADMIN, rights: [AccessRights.giveKey] })
  async grantKeys(@Param('id') _id: string) {
    return this.usersService.grantKeys(_id);
  }

  @Delete('users/:id/keys')
  @AccessControlList({ role: UserRole.ADMIN, isRoot: true })
  // @ApiTags('Revoke keys from regular user. Limited access.')
  @ApiOperation({ summary: 'Удаляет ключи пользователю. Ограниченный доступ' })
  @ApiOperation({ description: 'Удаляет ключи пользователю. Ограниченный доступ' })
  @ApiParam({
    name: 'id',
    description: 'Идентификатор пользователя',
    type: 'string',
    example: '66e00d39886d5b0bae564611',
    required: true,
  })
  @ApiResponse({
    status: 200,
    type: UserDto,
    description: 'Возвращает объект пользователя',
  })
  @ApiUnauthorizedResponse({
    description: 'Отсутствуют необходимые полномочия для выполнения данной операции',
  })
  @ApiBadRequestResponse({ description: 'Некорректный запрос' })
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async revokeKeys(@Param('id') _id: string) {
    throw new MethodNotAllowedException('Этот метод нельзя использовать здесь!');
    //  return this.usersService.revokeKeys(_id);
  }

  // Получение всех задач произвольного пользователя
  @Get('users/:id/tasks')
  // @ApiTags('Get all tasks of regular user. Limited access.')
  @ApiOperation({ summary: 'Получает все задачи пользователя по идентификатору' })
  @ApiOperation({ description: 'Получает все задачи пользователя по идентификатору' })
  @ApiParam({
    name: 'id',
    description: 'Идентификатор пользователя',
    type: 'string',
    example: '66e00d39886d5b0bae564611',
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: 'Возвращает список задач пользователя',
  })
  @ApiUnauthorizedResponse({
    description: 'Отсутствуют необходимые полномочия для выполнения данной операции',
  })
  @ApiBadRequestResponse({ description: 'Некорректный запрос' })
  @AccessControlList({ role: UserRole.ADMIN })
  async getTasks(@Param('id') _id: string): Promise<TaskInterface[]> {
    const user = (await this.usersService.getProfile(_id)) as unknown as AnyUserInterface;
    const results: TaskInterface[][] = await Promise.all(
      Object.values(TaskStatus).map((status) => this.tasksService.getOwnTasks(user, status))
    );
    return Promise.resolve(results.flat());
  }

  @Post('blog')
  // @ApiTags('Write a blog post. Limited access.')
  @ApiOperation({ summary: 'Создает новый пост' })
  @ApiOperation({ description: 'Создает новый пост' })
  @ApiBody({ type: PostDTO })
  @ApiUnauthorizedResponse({
    description: 'Отсутствуют необходимые полномочия для выполнения данной операции',
  })
  @ApiCreatedResponse({
    description: 'Ok',
    type: CreatedPostDto,
  })
  @ApiBadRequestResponse({ description: 'Некорректный запрос' })
  @AccessControlList({
    role: UserRole.ADMIN,
    rights: [AccessRights.createPost, AccessRights.contentEditor],
  })
  async createPost(@Request() req: Express.Request, @Body() dto: PostDTO) {
    return this.blogService.create(dto, req.user);
  }

  @Patch('blog/:id')
  // @ApiTags('Edit a blog post. Limited access.')
  @ApiOperation({ summary: 'Изменяет существующий пост' })
  @ApiOperation({ description: 'Изменяет существующий пост' })
  @ApiUnauthorizedResponse({
    description: 'Отсутствуют необходимые полномочия для выполнения данной операции',
  })
  @ApiParam({
    name: 'id',
    description: 'Идентификатор поста',
    type: 'string',
    example: '66e00d39886d5b0bae564611',
    required: true,
  })
  @ApiResponse({
    status: 200,
    type: CreatedPostDto,
    description: 'Ok',
  })
  @ApiBadRequestResponse({ description: 'Некорректный запрос' })
  @AccessControlList({
    role: UserRole.ADMIN,
    rights: [AccessRights.updatePost, AccessRights.contentEditor],
  })
  async updatePost(@Request() req: Express.Request, @Param('id') id: string, @Body() dto: PostDTO) {
    return this.blogService.updatePost(id, dto, req.user);
  }

  @Delete('blog/:id')
  // @ApiTags('Delete a blog post. Limited access.')
  @ApiOperation({ summary: 'Удаляет пост' })
  @ApiOperation({ description: 'Удаляет пост' })
  @ApiParam({
    name: 'id',
    description: 'Идентификатор поста',
    type: 'string',
    example: '66e00d39886d5b0bae564611',
    required: true,
  })
  @ApiResponse({
    status: 200,
    type: CreatedPostDto,
    description: 'Ok',
  })
  @ApiUnauthorizedResponse({
    description: 'Отсутствуют необходимые полномочия для выполнения данной операции',
  })
  @ApiBadRequestResponse({ description: 'Некорректный запрос' })
  @AccessControlList({
    role: UserRole.ADMIN,
    rights: [AccessRights.deletePost, AccessRights.contentEditor],
  })
  async deletePost(@Request() req: Express.Request, @Param('id') id: string) {
    return this.blogService.deletePost(id, req.user);
  }

  @Post('category')
  // @ApiTags('Create a category. Root only.')
  @ApiOperation({ summary: 'Создает категорию' })
  @ApiOperation({ description: 'Создает категорию' })
  @ApiBody({ type: ApiCreateCategoryDto })
  @ApiCreatedResponse({
    description: 'Ok',
    type: CreatedCategoryDto,
  })
  @ApiUnauthorizedResponse({
    description: 'Отсутствуют необходимые полномочия для выполнения данной операции',
  })
  @ApiBadRequestResponse({ description: 'Некорректный запрос' })
  @AccessControlList({
    role: UserRole.ADMIN,
    isRoot: true,
    rights: [AccessRights.categoryPoints],
  })
  public async createCategory(@Body() dto: ApiCreateCategoryDto, @Req() req: Express.Request) {
    return this.categoryService.createCategory(dto, req.user as AnyUserInterface);
  }

  @Patch('categories')
  // @ApiTags('Bulk update categories by ids. Admins only.')
  @ApiOperation({ summary: 'Массово обновляет категории по идентификаторам' })
  @ApiOperation({ description: 'Массово обновляет категории по идентификаторам' })
  @ApiBody({ type: ApiBulkUpdateCategoriesDto })
  @ApiResponse({
    status: 200,
    description: 'Ok',
  })
  @ApiUnauthorizedResponse({
    description: 'Отсутствуют необходимые полномочия для выполнения данной операции',
  })
  @ApiBadRequestResponse({ description: 'Некорректный запрос' })
  @AccessControlList({
    role: UserRole.ADMIN,
    rights: [AccessRights.categoryPoints],
  })
  async updateCategoriesByIds(
    @Body() dto: ApiBulkUpdateCategoriesDto,
    @Req() req: Express.Request
  ) {
    return this.categoryService.updateCategoriesByIds(dto, req.user as AnyUserInterface);
  }

  @Patch('categories/:id')
  // @ApiTags('Update category by id. Admins only.')
  @ApiOperation({ summary: 'Обновляет категорию по идентификатору' })
  @ApiOperation({ description: 'Обновляет категорию по идентификатору' })
  @ApiParam({
    name: 'id',
    description: 'Идентификатор категории',
    type: 'string',
    example: '66e00d39886d5b0bae564611',
    required: true,
  })
  @ApiResponse({
    status: 200,
    type: CreatedCategoryDto,
    description: 'Ok',
  })
  @ApiUnauthorizedResponse({
    description: 'Отсутствуют необходимые полномочия для выполнения данной операции',
  })
  @ApiBadRequestResponse({ description: 'Некорректный запрос' })
  @AccessControlList({
    role: UserRole.ADMIN,
    rights: [AccessRights.categoryPoints],
  })
  async updateCategoryById(
    @Param('id')
    id: string,
    @Body() dto: ApiUpdateCategoryDto,
    @Req() req: Express.Request
  ) {
    return this.categoryService.updateCategoryById(id, dto, req.user as AnyUserInterface);
  }

  @Delete('categories/:id')
  // @ApiTags('Delete category by id. Root only.')
  @ApiOperation({ summary: 'Удаляет категорию по идентификатору' })
  @ApiOperation({ description: 'Удаляет категорию по идентификатору' })
  @ApiParam({
    name: 'id',
    description: 'Идентификатор категории',
    type: 'string',
    example: '66e00d39886d5b0bae564611',
    required: true,
  })
  @ApiResponse({
    status: 200,
    type: CreatedCategoryDto,
    description: 'Ok',
  })
  @ApiUnauthorizedResponse({
    description: 'Отсутствуют необходимые полномочия для выполнения данной операции',
  })
  @ApiBadRequestResponse({ description: 'Некорректный запрос' })
  @AccessControlList({
    role: UserRole.ADMIN,
    isRoot: true,
    rights: [AccessRights.categoryPoints],
  })
  async deleteCategoryById(@Param('id') id: string, @Req() req: Express.Request) {
    return this.categoryService.removeCategory(id, req.user as AnyUserInterface);
  }

  @Get('tasks/conflicted')
  // @ApiTags('Get a list of conflicted tasks. Limited access.')
  @ApiOperation({ summary: 'Получает список конфликтных задач' })
  @ApiOperation({ description: 'Получает список конфликтных задач' })
  @ApiResponse({
    status: 200,
    type: ConflictedTasksDto,
    description: 'Ok',
  })
  @ApiUnauthorizedResponse({
    description: 'Отсутствуют необходимые полномочия для выполнения данной операции',
  })
  @ApiBadRequestResponse({ description: 'Некорректный запрос' })
  @AccessControlList({
    role: UserRole.ADMIN,
    rights: [AccessRights.resolveConflict],
  })
  public async getConflictedTasks() {
    return this.tasksService.getVirginConflictTasks();
  }

  @Get('users/volunteers')
  // @ApiTags('Get a list of volunteers')
  @ApiOperation({ summary: 'Получает список всех волонтеров' })
  @ApiOperation({ description: 'Получает список всех волонтеров' })
  @ApiResponse({
    status: 200,
    type: [UserDto],
    description: 'Ok',
  })
  @ApiUnauthorizedResponse({
    description: 'Отсутствуют необходимые полномочия для выполнения данной операции',
  })
  @ApiBadRequestResponse({ description: 'Некорректный запрос' })
  @AccessControlList({ role: UserRole.ADMIN, rights: [AccessRights.confirmUser] })
  public async getVolunteers() {
    return this.usersService.getUsersByRole(UserRole.VOLUNTEER);
  }

  @Get('users/recipients')
  // @ApiTags('Get a list of volunteers')
  @ApiOperation({ summary: 'Получает список всех реципиентов' })
  @ApiOperation({ description: 'Получает список всех реципиентов' })
  @ApiResponse({
    status: 200,
    type: [UserDto],
    description: 'Ok',
  })
  @ApiUnauthorizedResponse({
    description: 'Отсутствуют необходимые полномочия для выполнения данной операции',
  })
  @ApiBadRequestResponse({ description: 'Некорректный запрос' })
  @AccessControlList({ role: UserRole.ADMIN, rights: [AccessRights.confirmUser] })
  public async getRecipients() {
    return this.usersService.getUsersByRole(UserRole.RECIPIENT);
  }

  @Get('users/unconfirmed')
  // @ApiTags('Get a list of volunteers')
  @ApiOperation({ summary: 'Получает список неподтвержденных пользователей' })
  @ApiOperation({ description: 'Получает список неподтвержденных пользователей' })
  @ApiResponse({
    status: 200,
    type: [UserDto],
    description: 'Ok',
  })
  @ApiUnauthorizedResponse({
    description: 'Отсутствуют необходимые полномочия для выполнения данной операции',
  })
  @ApiBadRequestResponse({ description: 'Некорректный запрос' })
  @AccessControlList({ role: UserRole.ADMIN, rights: [AccessRights.confirmUser] })
  public async getUnconfirmed() {
    return this.usersService.getUnconfirmedUsers();
  }

  @Get('users/:id')
  @ApiOperation({ summary: 'Получает пользователя по идентификатору' })
  @ApiOperation({ description: 'Получает пользователя по идентификатору' })
  @ApiParam({
    name: 'id',
    description: 'Идентификатор пользотвателя',
    type: 'string',
    example: '66e00d39886d5b0bae564611',
    required: true,
  })
  @ApiResponse({
    status: 200,
    type: UserDto,
    description: 'Ok',
  })
  @ApiUnauthorizedResponse({
    description: 'Отсутствуют необходимые полномочия для выполнения данной операции',
  })
  @ApiBadRequestResponse({ description: 'Некорректный запрос' })
  @AccessControlList({ role: UserRole.ADMIN, rights: [AccessRights.createTask] })
  async user(@Param('id') _id: string) {
    return this.usersService.getProfile(_id);
  }

  @Put('tasks/:id/resolve')
  // @ApiTags('Start moderation')
  @ApiOperation({ summary: 'Начинает модерацию задачи' })
  @ApiOperation({ description: 'Начинает модерацию задачи' })
  @ApiParam({
    name: 'id',
    description: 'Идентификатор задачи',
    type: 'string',
    example: '66e00d39886d5b0bae564611',
    required: true,
  })
  @ApiResponse({
    status: 200,
    type: TaskDto,
    description: 'Ok',
  })
  @ApiUnauthorizedResponse({
    description: 'Отсутствуют необходимые полномочия для выполнения данной операции',
  })
  @ApiBadRequestResponse({ description: 'Некорректный запрос' })
  @AccessControlList({ role: UserRole.ADMIN, rights: [AccessRights.resolveConflict] })
  public async startModeration(@Param('id') taskId: string, @Req() req: Express.Request) {
    return this.tasksService.startModeration(taskId, req.user as AnyUserInterface);
  }

  @Put('tasks/:id/resolve/fulfill')
  // @ApiTags('Resolve conflict as fulfilled')
  @ApiOperation({ summary: 'Закрывает выполненную заявку' })
  @ApiOperation({ description: 'Закрывает выполненную заявку' })
  @ApiParam({
    name: 'id',
    description: 'Идентификатор задачи',
    type: 'string',
    example: '66e00d39886d5b0bae564611',
    required: true,
  })
  @ApiResponse({
    status: 200,
    type: TaskDto,
    description: 'Ok',
  })
  @ApiUnauthorizedResponse({
    description: 'Отсутствуют необходимые полномочия для выполнения данной операции',
  })
  @ApiBadRequestResponse({ description: 'Некорректный запрос' })
  @AccessControlList({ role: UserRole.ADMIN, rights: [AccessRights.resolveConflict] })
  public async resolveFulfilled(@Param('id') taskId: string) {
    return this.tasksService.resolveConflict(taskId, ResolveResult.FULFILLED);
  }

  @Put('tasks/:id/resolve/reject')
  // @ApiTags('Resolve conflict as rejected')
  @ApiOperation({ summary: 'Закрывает невыполненную заявку' })
  @ApiOperation({ description: 'Закрывает невыполненную заявку' })
  @ApiParam({
    name: 'id',
    description: 'Идентификатор задачи',
    type: 'string',
    example: '66e00d39886d5b0bae564611',
    required: true,
  })
  @ApiResponse({
    status: 200,
    type: TaskDto,
    description: 'Ok',
  })
  @ApiUnauthorizedResponse({
    description: 'Отсутствуют необходимые полномочия для выполнения данной операции',
  })
  @ApiBadRequestResponse({ description: 'Некорректный запрос' })
  @AccessControlList({ role: UserRole.ADMIN, rights: [AccessRights.resolveConflict] })
  public async resolveRejected(@Param('id') taskId: string) {
    return this.tasksService.resolveConflict(taskId, ResolveResult.REJECTED);
  }

  @Get('/tasks/moderated')
  // @ApiTags('Get moderated by admin')
  @ApiOperation({ summary: 'Получает список задач на модерации' })
  @ApiOperation({ description: 'Получает список задач на модерации' })
  @ApiResponse({
    status: 200,
    type: [TaskDto],
    description: 'Ok',
  })
  @ApiUnauthorizedResponse({
    description: 'Отсутствуют необходимые полномочия для выполнения данной операции',
  })
  @ApiBadRequestResponse({ description: 'Некорректный запрос' })
  @AccessControlList({ role: UserRole.ADMIN, rights: [AccessRights.resolveConflict] })
  public async getModeratedTasks(@Req() req: Express.Request) {
    return this.tasksService.getModeratedTasks(req.user as AnyUserInterface);
  }

  @Patch('contacts')
  // @ApiTags('Update a contacts data. Root only.')
  @ApiOperation({ summary: 'Обновляет контактные данные' })
  @ApiOperation({ description: 'Обновляет контактные данные' })
  @ApiResponse({
    status: 200,
    type: ContactInfoDto,
    description: 'Ok',
  })
  @ApiUnauthorizedResponse({
    description: 'Отсутствуют необходимые полномочия для выполнения данной операции',
  })
  @ApiBadRequestResponse({ description: 'Некорректный запрос' })
  @AccessControlList({ role: UserRole.ADMIN, isRoot: true })
  public async updateContacts(@Body() dto: UpdateContactsRequestDto) {
    return this.contactsService.update(dto);
  }
}
