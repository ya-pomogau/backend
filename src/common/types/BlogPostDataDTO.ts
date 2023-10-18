import { CreateBlogPostDto } from '../../datalake/blog-post/dto/create-blog-post.dto';
import { BlogPost } from '../../datalake/blog-post/schema/blog-post.schema';

export class BlogPostDataDTO extends BlogPost {
  _id: string;
}
