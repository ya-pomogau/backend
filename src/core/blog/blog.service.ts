import { BadRequestException, Injectable } from '@nestjs/common';
import { PostDTO } from '../../common/dto/blog.dto';
import { BlogPostRepository } from '../../datalake/blog-post/blog.repository';
import { UsersRepository } from '../../datalake/users/users.repository';

@Injectable()
export class BlogService {
  constructor(
    private readonly blogRepo: BlogPostRepository,
    private readonly userRepo: UsersRepository
  ) {}

  async create(dto: Partial<PostDTO>, user) {
    const { name, phone, avatar, address, _id } = await this.userRepo.findById(user.id);
    const newPost = await this.blogRepo.create({
      ...dto,
      author: {
        name,
        phone,
        avatar,
        address,
        _id,
      },
    });
    return newPost;
  }

  async find() {
    const posts = await this.blogRepo.find({});
    return posts;
  }

  async findByIdAndUpdate(postId: string, updateDto: Partial<PostDTO>, user) {
    const { author } = await this.blogRepo.findById(postId);

    if (!user.isRoot && author._id !== user.id) {
      throw new BadRequestException('Вы не можете редактировать чужой пост');
    }

    const post = await this.blogRepo.findByIdAndUpdate(postId, updateDto, {});
    return post;
  }

  async findByIdAndDelete(postId: string, user) {
    const { author } = await this.blogRepo.findById(postId);

    if (!user.isRoot && author._id !== user.id) {
      throw new BadRequestException('Вы не можете удалить чужой пост');
    }

    await this.blogRepo.findByIdAndDelete(postId);
    return {};
  }
}
