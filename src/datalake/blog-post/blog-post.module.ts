import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BlogPostService } from './blog-post.service';
import { BlogPost, BlogPostSchema } from './schema/blog-post.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: BlogPost.name, schema: BlogPostSchema }])],
  providers: [BlogPostService],
  exports: [BlogPostService],
})
export class BlogPostModule {}
