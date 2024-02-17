import { Controller, Get, Param, Query } from '@nestjs/common';
import { BlogService } from '../../core/blog/blog.service';
import { Public } from '../../common/decorators/public.decorator';
import { CategoriesService } from '../../core/categories/categories.service';
import { TasksService } from '../../core/tasks/tasks.service';
import { GetTasksQueryDto } from '../recipient-api/dto/get-tasks-query.dto';

@Controller('system')
export class SystemApiController {
  constructor(
    private readonly blogService: BlogService,
    private readonly categoriesService: CategoriesService,
    private readonly taskService: TasksService
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
}
