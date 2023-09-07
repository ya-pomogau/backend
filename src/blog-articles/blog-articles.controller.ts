import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { BlogArticlesService } from './blog-articles.service';
import { CreateBlogArticleDto } from './dto/create-blog-article.dto';
import { UpdateBlogArticleDto } from './dto/update-blog-article.dto';
import { AuthUser } from '../auth/decorators/auth-user.decorator';
import { User } from '../users/entities/user.entity';
import { UserRolesGuard } from '../auth/guards/user-roles.guard';
import { AdminPermissionsGuard } from '../auth/guards/admin-permissions.guard';
import { UserRoles } from '../auth/decorators/user-roles.decorator';
import { AdminPermission, EUserRole } from '../users/types';
import { AdminPermissions } from '../auth/decorators/admin-permissions.decorator';
import { BlogArticle } from './entities/blog-article.entity';
import { JwtGuard } from '../auth/guards/jwt.guard';
import exceptions from '../common/constants/exceptions';
import { BypassAuth } from '../auth/decorators/bypass-auth.decorator';

@ApiTags('Blog')
@ApiBearerAuth()
@UseGuards(JwtGuard)
@Controller('blog-articles')
export class BlogArticlesController {
  constructor(private readonly blogArticlesService: BlogArticlesService) {}

  @ApiOperation({
    summary: 'Создание новой записи в блоге',
    description: 'Доступ только для администраторов',
  })
  @ApiOkResponse({
    status: 200,
    type: BlogArticle,
  })
  @ApiForbiddenResponse({
    status: 403,
    description: exceptions.users.onlyForAdmins,
  })
  @UseGuards(UserRolesGuard, AdminPermissionsGuard)
  @UserRoles(EUserRole.ADMIN, EUserRole.MASTER)
  @AdminPermissions(AdminPermission.BLOG)
  @Post()
  async create(@AuthUser() user: User, @Body() createBlogArticleDto: CreateBlogArticleDto) {
    return this.blogArticlesService.create(user._id, createBlogArticleDto);
  }

  @ApiOperation({
    summary: 'Список статей блога',
  })
  @ApiOkResponse({
    status: 200,
    type: BlogArticle,
    isArray: true,
  })
  @BypassAuth()
  @Get()
  async findAll() {
    return this.blogArticlesService.findAll();
  }

  @ApiOperation({
    summary: 'Поиск статьи по id',
  })
  @ApiOkResponse({
    status: 200,
    type: BlogArticle,
  })
  @BypassAuth()
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.blogArticlesService.findOne(id);
  }

  @ApiOperation({
    summary: 'Редактирование записи в блоге',
    description: 'Доступ только для администраторов',
  })
  @ApiOkResponse({
    status: 200,
    type: BlogArticle,
  })
  @ApiForbiddenResponse({
    status: 403,
    description: exceptions.users.onlyForAdmins,
  })
  @UseGuards(UserRolesGuard, AdminPermissionsGuard)
  @UserRoles(EUserRole.ADMIN, EUserRole.MASTER)
  @AdminPermissions(AdminPermission.BLOG)
  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateBlogArticleDto: UpdateBlogArticleDto) {
    return this.blogArticlesService.update(id, updateBlogArticleDto);
  }

  @ApiOperation({
    summary: 'Удаление записи в блоге',
    description: 'Доступ только для администраторов',
  })
  @ApiOkResponse({
    status: 200,
    type: BlogArticle,
  })
  @ApiForbiddenResponse({
    status: 403,
    description: exceptions.users.onlyForAdmins,
  })
  @UseGuards(UserRolesGuard, AdminPermissionsGuard)
  @UserRoles(EUserRole.ADMIN, EUserRole.MASTER)
  @AdminPermissions(AdminPermission.BLOG)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.blogArticlesService.remove(id);
  }
}
