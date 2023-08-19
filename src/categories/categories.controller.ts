import { Controller, Get, Post, Body, Patch, Param, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { UserRolesGuard } from '../auth/guards/user-roles.guard';
import { AdminPermissionsGuard } from '../auth/guards/admin-permissions.guard';
import { UserRoles } from '../auth/decorators/user-roles.decorator';
import { AdminPermission, UserRole } from '../users/types';
import { AdminPermissions } from '../auth/decorators/admin-permissions.decorator';
import { Category } from './entities/category.entity';

@ApiTags('Categories')
@ApiBearerAuth()
@UseGuards(JwtGuard)
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @ApiOkResponse({
    status: 200,
    type: Category,
  })
  @UseGuards(UserRolesGuard, AdminPermissionsGuard)
  @UserRoles(UserRole.ADMIN, UserRole.MASTER)
  @AdminPermissions(AdminPermission.CATEGORIES)
  @Post()
  async create(@Body() createCategoryDto: CreateCategoryDto): Promise<Category> {
    return this.categoriesService.create(createCategoryDto);
  }

  @ApiOkResponse({
    status: 200,
    type: Category,
    isArray: true,
  })
  @Get()
  async findAll(): Promise<Category[]> {
    return this.categoriesService.findAll();
  }

  @ApiOkResponse({
    status: 200,
    type: Category,
  })
  @Get(':id')
  async findById(@Param('id') id: string): Promise<Category> {
    return this.categoriesService.findById(id);
  }

  @ApiOkResponse({
    status: 200,
    type: Category,
  })
  @UseGuards(UserRolesGuard, AdminPermissionsGuard)
  @UserRoles(UserRole.ADMIN, UserRole.MASTER)
  @AdminPermissions(AdminPermission.CATEGORIES)
  @Patch(':id')
  async updateCategory(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto
  ): Promise<Category> {
    return this.categoriesService.update(id, updateCategoryDto);
  }
}
