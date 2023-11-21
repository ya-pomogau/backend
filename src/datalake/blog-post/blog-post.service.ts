import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import exceptions from "src/common/constants/exceptions";
import { CreateBlogPostDto } from "./dto/create-blog-post.dto";
import { UpdateBlogPostDto } from "./dto/update-blog-post.dto";
import { BlogPost } from "./schema/blog-post.schema";

@Injectable()
export class BlogPostService {
  constructor(
    @InjectModel(BlogPost.name) private BlogPostModel: Model<BlogPost>
  ) {}

  async create(
    createBlogPostDto: CreateBlogPostDto
  ): Promise<CreateBlogPostDto> {
    const createdPost = new this.BlogPostModel(createBlogPostDto);
    const savedPost = await createdPost.save();
    return savedPost.toObject();
  }

  async findAll(): Promise<BlogPost[]> {
    return this.BlogPostModel.find().lean().exec();
  }

  async findOne(id: string): Promise<BlogPost> {
    return this.BlogPostModel.findById(id)
      .orFail(new NotFoundException(exceptions.blogArticles.notFound))
      .lean()
      .exec();
  }

  async update(
    id: string,
    updateBlogPostDto: UpdateBlogPostDto
  ): Promise<UpdateBlogPostDto> {
    return this.BlogPostModel.findByIdAndUpdate(id, updateBlogPostDto)
      .orFail(new NotFoundException(exceptions.blogArticles.notFound))
      .lean()
      .exec();
  }

  async remove(id: string): Promise<BlogPost> {
    return this.BlogPostModel.findByIdAndDelete(id)
      .orFail(new NotFoundException(exceptions.blogArticles.notFound))
      .lean()
      .exec();
  }
}
