import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { UserStatus } from '../../../common/types/user.types';
import { CategoryInterface } from '../../../common/types/category.types';

@Schema({ timestamps: true })
export class Category extends Document implements CategoryInterface {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true, type: Number })
  points: number;

  @Prop({ required: true, enum: Object.values(UserStatus), type: Number })
  accessLevel: number;
}

export const CategorySchema = SchemaFactory.createForClass(Category);
