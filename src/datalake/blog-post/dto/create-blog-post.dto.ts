import { IBlogPost } from '../schema/blog-post.schema';

export class CreateBlogPostDto implements Omit<IBlogPost, 'createdAt' | 'updatedAt'> {
  author: string;

  title: string;

  text: string;

  files: string[];
}
