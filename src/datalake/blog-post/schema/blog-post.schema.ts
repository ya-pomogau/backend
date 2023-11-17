import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export interface IBlogPost {
  author: string;
  title: string;
  text: string;
  files: string[];
}

@Schema({ timestamps: true })
export class BlogPost implements IBlogPost {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  author: string;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  text: string;

  @Prop({ required: true, type: [String] })
  files: string[];
}

export const BlogPostSchema = SchemaFactory.createForClass(BlogPost);
export type BlogPostDocument = HydratedDocument<BlogPost>;
