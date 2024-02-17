import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { BlogService } from '../../core/blog/blog.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { Public } from '../../common/decorators/public.decorator';
import { AccessControlGuard } from '../../common/guards/access-control.guard';

@UseGuards(JwtAuthGuard)
@UseGuards(AccessControlGuard)
@Controller('system')
export class SystemApiController {
  constructor(private readonly blogService: BlogService) {}

  @Get('posts')
  @Public()
  async getAllBlogPosts() {
    return this.blogService.getAllPosts();
  }

  @Get('posts/:id')
  @Public()
  async getBlogPost(@Param('id') id: string) {
    return this.blogService.getPost(id);
  }
}
