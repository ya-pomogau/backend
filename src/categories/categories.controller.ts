import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  ValidationPipe,
  UseGuards,
} from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { UserRolesGuard } from '../auth/guards/user-roles.guard';
import { AdminPermissionsGuard } from '../auth/guards/admin-permissions.guard';
import { UserRoles } from '../auth/decorators/user-roles.decorator';
import { AdminPermission, UserRole } from '../users/types';
import { AdminPermissions } from '../auth/decorators/admin-permissions.decorator';

@UseGuards(JwtGuard)
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @UseGuards(UserRolesGuard, AdminPermissionsGuard)
  @UserRoles(UserRole.ADMIN, UserRole.MASTER)
  @AdminPermissions(AdminPermission.CATEGORIES)
  @Post()
  create(@Body(new ValidationPipe()) createCategoryDto: CreateCategoryDto) {
    return this.categoriesService.create(createCategoryDto);
  }

  @Get()
  async findAll() {
    return this.categoriesService.findAll();
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    return this.categoriesService.findById(id);
  }

  @UseGuards(UserRolesGuard, AdminPermissionsGuard)
  @UserRoles(UserRole.ADMIN, UserRole.MASTER)
  @AdminPermissions(AdminPermission.CATEGORIES)
  @Patch(':id')
  async updateCategory(@Param('id') id: string, @Body() updateCategoryDto: UpdateCategoryDto) {
    return this.categoriesService.update(id, updateCategoryDto);
  }
}
