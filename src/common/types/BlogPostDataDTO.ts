import { IBlogPost } from '../../datalake/blog-post/schema/blog-post.schema';

export interface BlogPostDataDTO extends IBlogPost {
  _id: string;
  createdAt: Date;
  updatedAt: Date;
}
