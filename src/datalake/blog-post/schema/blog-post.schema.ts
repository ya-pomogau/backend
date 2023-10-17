import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

@Schema({ timestamps: true })
export class BlogPost {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Author' })
  author: Author;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  text: string;

  @Prop({ required: true, type: [String] })
  files: string[];
}

export const BlogPostSchema = SchemaFactory.createForClass(BlogPost);
export type BlogPostDocument = HydratedDocument<BlogPost>;
