import { Module } from '@nestjs/common';
import { BlogApiController } from './blog-api.controller';
import { BlogModule } from '../../core/blog/blog.module';

@Module({
  imports: [BlogModule],
  controllers: [BlogApiController],
  providers: [],
})
export class BlogApiModule {}
