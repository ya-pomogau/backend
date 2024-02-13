import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BlogPost } from './schema/blog-post.schema';
import { BaseRepositoryService } from '../base-repository/base-repository.service';

@Injectable()
export class BlogPostRepository extends BaseRepositoryService<BlogPost> {
  constructor(@InjectModel(BlogPost.name) private blogPostModel: Model<BlogPost>) {
    super(blogPostModel);
  }
}
