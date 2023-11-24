import { BlogArticlesService } from './blog-articles.service';
import { CreateBlogArticleDto } from './dto/create-blog-article.dto';
import { UpdateBlogArticleDto } from './dto/update-blog-article.dto';
import { User } from '../users/entities/user.entity';
import { BlogArticle } from './entities/blog-article.entity';
export declare class BlogArticlesController {
    private readonly blogArticlesService;
    constructor(blogArticlesService: BlogArticlesService);
    create(user: User, createBlogArticleDto: CreateBlogArticleDto): Promise<BlogArticle>;
    upload(file: any): Promise<string>;
    getImage(id: string, res: any): Promise<any>;
    findAll(): Promise<BlogArticle[]>;
    findOne(id: string): Promise<BlogArticle>;
    update(id: string, updateBlogArticleDto: UpdateBlogArticleDto): Promise<BlogArticle>;
    deleteImage(id: string): Promise<void>;
    remove(id: string): Promise<void>;
    removeUnused(): Promise<void>;
}
