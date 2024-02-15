import {
  Body,
  Controller,
  Delete,
  Param,
  Post,
  Put,
  UseGuards,
  Patch,
  Request,
  Req,
} from '@nestjs/common';
import { MethodNotAllowedException } from '@nestjs/common/exceptions';
import { UsersService } from '../../core/users/users.service';
import { NewAdminDto } from './dto/new-admin.dto';
import { AnyUserInterface, UserRole } from '../../common/types/user.types';
import { AccessControlGuard } from '../../common/guards/access-control.guard';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { AccessControlList } from '../../common/decorators/access-control-list.decorator';
import { AccessRights } from '../../common/types/access-rights.types';
import { PostDTO } from './dto/new-post.dto';
import { BlogService } from '../../core/blog/blog.service';
import { ApiCreateCategoryDto } from './dto/new-category.dto';
import { CategoriesService } from '../../core/categories/categories.service';

@UseGuards(JwtAuthGuard)
@UseGuards(AccessControlGuard)
@Controller('admin')
export class AdminApiController {
  constructor(
    private readonly usersService: UsersService,
    private readonly blogService: BlogService,
    private readonly categoryService: CategoriesService
  ) {}

  @Post('create')
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
  @AccessControlList({ role: UserRole.ADMIN, isRoot: true })
  async activate(@Param('id') _id: string) {
    return this.usersService.activate(_id);
  }

  @Delete(':id/activate')
  @AccessControlList({ role: UserRole.ADMIN, isRoot: true })
  async deactivate(@Param('id') _id: string) {
    return this.usersService.deactivate(_id);
  }

  @Put('/:id/confirm')
  @AccessControlList({ role: UserRole.ADMIN, rights: [AccessRights.confirmUser] })
  async confirm(@Param('id') _id: string) {
    return this.usersService.confirm(_id);
  }

  @Delete('/:id/confirm')
  @AccessControlList({ role: UserRole.ADMIN, rights: [AccessRights.blockUser] })
  async block(@Param('id') _id: string) {
    return this.usersService.block(_id);
  }

  @Put('/:id/promote')
  @AccessControlList({ role: UserRole.ADMIN, rights: [AccessRights.promoteUser] })
  async upgrade(@Param('id') _id: string) {
    return this.usersService.upgrade(_id);
  }

  @Delete('/:id/promote')
  @AccessControlList({ role: UserRole.ADMIN, isRoot: true })
  async downgrade(@Param('id') _id: string) {
    throw new MethodNotAllowedException('Этот метод нельзя использовать здесь!');
    // return this.usersService.downgrade(_id);
  }

  @Put('/:id/keys')
  @AccessControlList({ role: UserRole.ADMIN, rights: [AccessRights.giveKey] })
  async grantKeys(@Param('id') _id: string) {
    return this.usersService.grantKeys(_id);
  }

  @Delete('/:id/keys')
  @AccessControlList({ role: UserRole.ADMIN, isRoot: true })
  async revokeKeys(@Param('id') _id: string) {
    throw new MethodNotAllowedException('Этот метод нельзя использовать здесь!');
    //  return this.usersService.revokeKeys(_id);
  }

  @Post('blog')
  @AccessControlList({
    role: UserRole.ADMIN,
    rights: [AccessRights.createPost, AccessRights.contentEditor],
  })
  async createPost(@Request() req: Express.Request, @Body() dto: PostDTO) {
    return this.blogService.create(dto, req.user);
  }

  // TODO: перенести в SystemApi
  // @Get('blog')
  // async getAllPosts() {
  //   return this.blogService.getAllPosts();
  // }

  @Patch('blog/:id')
  @AccessControlList({
    role: UserRole.ADMIN,
    rights: [AccessRights.updatePost, AccessRights.contentEditor],
  })
  async updatePost(@Request() req: Express.Request, @Param('id') id: string, @Body() dto: PostDTO) {
    return this.blogService.updatePost(id, dto, req.user);
  }

  @Delete('blog/:id')
  @AccessControlList({
    role: UserRole.ADMIN,
    rights: [AccessRights.deletePost, AccessRights.contentEditor],
  })
  async deletePost(@Request() req: Express.Request, @Param('id') id: string) {
    return this.blogService.deletePost(id, req.user);
  }

  @Post('category')
  @AccessControlList({
    role: UserRole.ADMIN,
    isRoot: true,
    rights: [AccessRights.categoryPoints],
  })
  public async createCategory(@Body() dto: ApiCreateCategoryDto, @Req() req: Express.Request) {
    return this.categoryService.createCategory(dto, req.user as AnyUserInterface);
  }
}
