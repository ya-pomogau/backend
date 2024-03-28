import { Module } from '@nestjs/common';
import { BlogRepositoryModule } from '../../datalake/blog-post/blog-repository.module';
import { BlogService } from './blog.service';
import { UsersRepositoryModule } from '../../datalake/users/users-repository.module';

@Module({
  imports: [BlogRepositoryModule, UsersRepositoryModule],
  providers: [BlogService],
  exports: [BlogService],
})
export class BlogModule {}
