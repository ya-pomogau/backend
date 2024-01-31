import { Body, Controller, Post, Get, UseGuards, Param, Patch, Delete, Req, Query } from '@nestjs/common';
import { CategoriesService } from 'src/core/categories/categories.service';
import { NewCategoryDto } from './dto/new-category.dto';
import { UserRole, AdminPermission } from '../../common/types/user.types';
import { AccessControlGuard } from '../../common/guards/access-control.guard';
// import { Root } from '../../common/decorators/root.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
// import { Role } from '../../common/decorators/roles.decorator';
import { AccessControlList } from '../../common/decorators/access-control-list.decorator';
import { Public } from 'src/common/decorators/public.decorator';
import { UpdateCategoryDto } from './dto/update-category.dto';

// @UseGuards(JwtAuthGuard)
// @UseGuards(AccessControlGuard)

@Controller('categories')
export class CategoriesApiController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Public()
  @Get()
  // @AccessControlList({ role: UserRole.ADMIN, permissions: AdminPermission.CATEGORIES})
  async getAll() {
    return this.categoriesService.getCategories();
  }

  @Public()
  @Patch()
  async updateCategories(@Body() data: Record<string, number>, @Req() req) {
    console.log('TTTTT')
    return this.categoriesService.updateCategories(data, req.user);
  }

  @Public()
  @Get('/:id')
  // @AccessControlList({ role: UserRole.ADMIN, permissions: AdminPermission.CATEGORIES})
  async getCategory(@Param('id') id: string) {
    return this.categoriesService.getCategoryById(id);
  }

  @Public()
  @Post('new')
  // @AccessControlList({ role: UserRole.ADMIN, permissions: AdminPermission.CATEGORIES})
  async create(@Body() dto: NewCategoryDto, @Req() req) {
    return this.categoriesService.createCategory(dto, req.user);
  }

  @Public()
  @Patch('/:id')
  async update(@Param('id') id: string, @Body() updateData: UpdateCategoryDto, @Req() req) {
    return this.categoriesService.updateCategoryById(id, updateData, req.user);
  }

  @Public()
  @Delete('/:id')
  async delete(@Param('id') id: string, @Req() req) {
    return this.categoriesService.removeCategory(id, req.user);
  }






}
