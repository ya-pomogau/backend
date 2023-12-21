import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes } from 'mongoose';
import { BlogPostInterface } from '../../../common/types/blog-post.types';
import { UserProfileInterface } from '../../../common/types/user.types';
import { UserProfileSchema } from '../../../common/schemas/user-profile.schema';

@Schema({
  timestamps: true,
  toObject: {
    versionKey: false,
    virtuals: true,
  },
})
export class BlogPost extends Document implements BlogPostInterface {
  @Prop({ type: UserProfileSchema, required: true, immutable: true })
  author: UserProfileInterface;

  @Prop({ required: true, type: SchemaTypes.String })
  title: string;

  @Prop({ required: true, type: SchemaTypes.String })
  text: string;

  @Prop({ required: false, default: [], type: [String] })
  files: string[];
}

export const BlogPostSchema = SchemaFactory.createForClass(BlogPost);
