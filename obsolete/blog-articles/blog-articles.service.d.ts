import { ObjectId } from 'mongodb';
import { MongoRepository } from 'typeorm';
import { CreateBlogArticleDto } from './dto/create-blog-article.dto';
import { UpdateBlogArticleDto } from './dto/update-blog-article.dto';
import { BlogArticle } from './entities/blog-article.entity';
export declare class BlogArticlesService {
    private readonly blogArticleRepository;
    constructor(blogArticleRepository: MongoRepository<BlogArticle>);
    create(authorId: ObjectId, createBlogArticleDto: CreateBlogArticleDto): Promise<BlogArticle>;
    findAll(): Promise<BlogArticle[]>;
    findOne(id: string): Promise<BlogArticle>;
    update(id: string, updateBlogArticleDto: UpdateBlogArticleDto): Promise<BlogArticle>;
    remove(id: string): Promise<void>;
    findUsedImages(): Promise<string[]>;
}
