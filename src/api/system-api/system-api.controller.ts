import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { BlogService } from '../../core/blog/blog.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { Public } from '../../common/decorators/public.decorator';

@UseGuards(JwtAuthGuard)
@Controller('system')
export class SystemApiController {
  constructor(private readonly blogService: BlogService) {}

  @Get('posts')
  @Public()
  async getAllPosts() {
    return this.blogService.getAllPosts();
  }

  @Get('posts/:id')
  @Public()
  async getPost(@Param('id') id: string) {
    return this.blogService.getPost(id);
  }
}
