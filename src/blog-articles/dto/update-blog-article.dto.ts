import { PartialType } from '@nestjs/swagger';
import { CreateBlogArticleDto } from './create-blog-article.dto';

export class UpdateBlogArticleDto extends PartialType(CreateBlogArticleDto) {}
