import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BlogArticlesService } from './blog-articles.service';
import { BlogArticlesController } from './blog-articles.controller';
import { BlogArticle } from './entities/blog-article.entity';

@Module({
  imports: [TypeOrmModule.forFeature([BlogArticle])],
  controllers: [BlogArticlesController],
  providers: [BlogArticlesService],
})
export class BlogArticlesModule {}
