import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { CreateBlogPostDto } from './dto/create-blog-post.dto';
import { UpdateBlogPostDto } from './dto/update-blog-post.dto';
import { BlogPost } from './schema/blog-post.schema';

@Injectable()
export class BlogPostService {
  constructor(@InjectModel(BlogPost.name) private BlogPostModel: Model<BlogPost>) {}

  async create(createBlogPostDto: CreateBlogPostDto): Promise<CreateBlogPostDto> {
    const createdPost = new this.BlogPostModel(createBlogPostDto);
    const savedPost = await createdPost.save();
    return savedPost.toObject();
  }

  async findAll(): Promise<BlogPost[]> {
    return this.BlogPostModel.find().lean().exec();
  }

  async findOne(id: mongoose.Schema.Types.ObjectId): Promise<BlogPost> {
    return this.BlogPostModel.findById(id).lean().exec();
  }

  async update(
    id: mongoose.Schema.Types.ObjectId,
    updateBlogPostDto: UpdateBlogPostDto
  ): Promise<UpdateBlogPostDto> {
    return this.BlogPostModel.findByIdAndUpdate(id, updateBlogPostDto).lean().exec();
  }

  async remove(id: mongoose.Schema.Types.ObjectId): Promise<BlogPost> {
    return this.BlogPostModel.findByIdAndDelete(id).lean().exec();
  }
}
