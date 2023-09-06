import { Controller, Get, Post, Body, Patch, Param, UseGuards } from '@nestjs/common';

import {
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { UserRolesGuard } from '../auth/guards/user-roles.guard';
import { AdminPermissionsGuard } from '../auth/guards/admin-permissions.guard';
import { UserRoles } from '../auth/decorators/user-roles.decorator';

import { AdminPermission, EUserRole } from '../users/types';
import { AdminPermissions } from '../auth/decorators/admin-permissions.decorator';
import { Category } from './entities/category.entity';
import exceptions from '../common/constants/exceptions';

@ApiTags('Categories')
@ApiBearerAuth()
@UseGuards(JwtGuard)
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @ApiOperation({
    summary: 'Создание новой категории',
    description: 'Доступ только для администраторов с соответствующим статусом.',
  })
  @ApiOkResponse({
    status: 200,
    type: Category,
  })
  @ApiForbiddenResponse({
    status: 403,
    description: exceptions.users.onlyForAdmins,
  })
  @UseGuards(UserRolesGuard, AdminPermissionsGuard)
  @UserRoles(EUserRole.ADMIN, EUserRole.MASTER)
  @AdminPermissions(AdminPermission.CATEGORIES)
  @Post()
  async create(@Body() createCategoryDto: CreateCategoryDto): Promise<Category> {
    return this.categoriesService.create(createCategoryDto);
  }

  @ApiOperation({
    summary: 'Список всех категорий',
  })
  @ApiOkResponse({
    status: 200,
    type: Category,
    isArray: true,
  })
  @Get()
  async findAll(): Promise<Category[]> {
    return this.categoriesService.findAll();
  }

  @ApiOperation({
    summary: 'Поиск категории по id',
  })
  @ApiOkResponse({
    status: 200,
    type: Category,
  })
  @Get(':id')
  async findById(@Param('id') id: string): Promise<Category> {
    return this.categoriesService.findById(id);
  }

  @ApiOperation({
    summary: 'Редактирование категории',
    description:
      'Доступ только для администраторов с соответствующим статусом. При обновлении баллов или уровня доступа происходит автоматическое обновление данных полей во всех незакрытых заявках категории.',
  })
  @ApiOkResponse({
    status: 200,
    type: Category,
  })
  @ApiForbiddenResponse({
    status: 403,
    description: exceptions.users.onlyForAdmins,
  })
  @UseGuards(UserRolesGuard, AdminPermissionsGuard)
  @UserRoles(EUserRole.ADMIN, EUserRole.MASTER)
  @AdminPermissions(AdminPermission.CATEGORIES)
  @Patch(':id')
  async updateCategory(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto
  ): Promise<Category> {
    return this.categoriesService.update(id, updateCategoryDto);
  }
}
