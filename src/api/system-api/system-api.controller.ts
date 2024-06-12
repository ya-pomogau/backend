import { Body, Controller, Get, Param, Patch, Query, Req, UseGuards } from '@nestjs/common';
import { BlogService } from '../../core/blog/blog.service';
import { Public } from '../../common/decorators/public.decorator';
import { CategoriesService } from '../../core/categories/categories.service';
import { TasksService } from '../../core/tasks/tasks.service';
import { GetTasksQueryDto } from '../recipient-api/dto/get-tasks-query.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { UsersService } from '../../core/users/users.service';
import { AnyUserInterface, UserRole } from '../../common/types/user.types';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ContactsService } from '../../core/contacts/contacts.service';
import { PolicyService } from '../../core/policy/policy.service';
import { AuthService } from '../../core/auth/auth.service';
import { ApiTags } from '@nestjs/swagger';
import { AccessControlList } from 'src/common/decorators/access-control-list.decorator';
import { UpdateContactsRequestDto } from 'src/common/dto/contacts.dto';

@Controller('system')
export class SystemApiController {
  constructor(
    private readonly blogService: BlogService,
    private readonly categoriesService: CategoriesService,
    private readonly taskService: TasksService,
    private readonly userService: UsersService,
    private readonly contactsService: ContactsService,
    private readonly policyService: PolicyService,
    private readonly authService: AuthService
  ) {}

  @Get('posts')
  @Public()
  public async getAllBlogPosts() {
    return this.blogService.getAllPosts();
  }

  @Get('posts/:id')
  @Public()
  public async getBlogPost(@Param('id') id: string) {
    return this.blogService.getPost(id);
  }

  @Get('categories')
  @Public()
  public async getCategories() {
    return this.categoriesService.getCategories();
  }

  @Get('categories/:id')
  @Public()
  public async getCategory(@Param('id') categoryId: string) {
    return this.categoriesService.getCategoryById(categoryId);
  }

  @Get('tasks/virgin')
  @Public()
  public async getVirginTasks(@Query() query: GetTasksQueryDto) {
    const { latitude, longitude, ...data } = query;
    return this.taskService.getAllVirginTasks({
      ...data,
      location: [longitude, latitude],
    });
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  public async getProfile(@Req() req: Express.Request) {
    const { _id } = req.user as AnyUserInterface;
    return this.userService.getProfile(_id);
  }

  @Patch('profile')
  @UseGuards(JwtAuthGuard)
  public async updateProfile(@Req() req: Express.Request, @Body() dto: UpdateProfileDto) {
    const { _id } = req.user as AnyUserInterface;
    const profile = await this.userService.updateProfile(_id, dto);
    const token = await this.authService.authenticate({ ...profile });
    return Promise.resolve({ ...profile, token });
  }

  @Get('contacts')
  @Public()
  public async getContacts() {
    return this.contactsService.getActual();
  }

  @Patch('contacts')
  @ApiTags('Update a contacts data. Root only.')
  @AccessControlList({ role: UserRole.ADMIN, isRoot: true })
  public async updateContacts(@Req() req: Express.Request, @Body() dto: UpdateContactsRequestDto) {
    return this.contactsService.update(dto);
  }

  @Get('policy')
  @Public()
  public async getPolicy() {
    return this.policyService.getActual();
  }
}
