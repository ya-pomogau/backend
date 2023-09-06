import { Injectable } from '@nestjs/common';
import { ObjectId } from 'mongodb';
import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository } from 'typeorm';
import { CreateBlogArticleDto } from './dto/create-blog-article.dto';
import { UpdateBlogArticleDto } from './dto/update-blog-article.dto';
import checkValidId from '../common/helpers/checkValidId';
import { BlogArticle } from './entities/blog-article.entity';

@Injectable()
export class BlogArticlesService {
  constructor(
    @InjectRepository(BlogArticle)
    private readonly blogArticleRepository: MongoRepository<BlogArticle>
  ) {}

  async create(authorId: ObjectId, createBlogArticleDto: CreateBlogArticleDto) {
    const newArticle = await this.blogArticleRepository.create({
      ...createBlogArticleDto,
      authorId: authorId.toString(),
    });

    return this.blogArticleRepository.save(newArticle);
  }

  findAll() {
    return this.blogArticleRepository.find();
  }

  findOne(id: string) {
    checkValidId(id);
    const objectId = new ObjectId(id);
    return this.blogArticleRepository.findOneBy({ _id: objectId });
  }

  async update(id: string, updateBlogArticleDto: UpdateBlogArticleDto) {
    checkValidId(id);
    const objectId = new ObjectId(id);
    await this.blogArticleRepository.update({ _id: objectId }, updateBlogArticleDto);

    return this.blogArticleRepository.findOneBy({ _id: objectId });
  }

  async remove(id: string) {
    checkValidId(id);
    const objectId = new ObjectId(id);
    await this.blogArticleRepository.delete(objectId);
  }
}
