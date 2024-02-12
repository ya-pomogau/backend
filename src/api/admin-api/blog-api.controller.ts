import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { AccessControlGuard } from '../../common/guards/access-control.guard';
import { Public } from '../../common/decorators/public.decorator';
import { PostDTO } from './dto/new-post.dto';
import { BlogService } from '../../core/blog/blog.service';
import { UserRole } from '../../common/types/user.types';
import { AccessControlList } from '../../common/decorators/access-control-list.decorator';
import { AccessRights } from '../../common/types/access-rights.types';

@UseGuards(JwtAuthGuard)
@UseGuards(AccessControlGuard)
@Controller('posts')
export class BlogApiController {
  constructor(private readonly blogService: BlogService) {}

  @Post()
  @AccessControlList({ role: UserRole.ADMIN, rights: [AccessRights.createPost] })
  async create(@Request() req: Express.Request, @Body() dto: PostDTO) {
    const newPost = await this.blogService.create(dto, req.user);
    return newPost;
  }

  @Get()
  @Public()
  async find() {
    const posts = await this.blogService.find();
    return posts;
  }

  @Patch(':id')
  @AccessControlList({ role: UserRole.ADMIN, rights: [AccessRights.updatePost] })
  async findByIdAndUpdate(
    @Request() req: Express.Request,
    @Param('id') id: string,
    @Body() dto: Partial<PostDTO>
  ) {
    const editedPost = await this.blogService.findByIdAndUpdate(id, dto, req.user);
    return editedPost;
  }

  @Delete(':id')
  @AccessControlList({ role: UserRole.ADMIN, rights: [AccessRights.deletePost] })
  async findByIdAndDelete(@Request() req: Express.Request, @Param('id') id: string) {
    return this.blogService.findByIdAndDelete(id, req.user);
  }
}
