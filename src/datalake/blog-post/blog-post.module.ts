import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BlogPostRepository } from './blog-post.repository';
import { BlogPost, BlogPostSchema } from './schema/blog-post.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: BlogPost.name, schema: BlogPostSchema }])],
  providers: [BlogPostRepository],
  exports: [BlogPostRepository],
})
export class BlogPostModule {}
