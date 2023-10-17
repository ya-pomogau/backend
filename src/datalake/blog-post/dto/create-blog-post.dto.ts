import mongoose from 'mongoose';

export class CreateBlogPostDto {
  author: mongoose.Schema.Types.ObjectId;

  title: string;

  text: string;

  files: string[];

  createdAt: Date;

  updatedAt: Date;
}
