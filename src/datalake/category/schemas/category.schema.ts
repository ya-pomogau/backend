import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { UserStatus } from '../../../users/types';
import { CategoryInterface } from '../../../common/types/category.types';

@Schema({
  timestamps: true,
  toObject: {
    versionKey: false,
    virtuals: true,
  },
})
export class Category extends Document implements CategoryInterface {
  @Prop({ required: true, immutable: true })
  title: string;

  @Prop({ required: true, type: Number })
  points: number;

  @Prop({ required: true, enum: Object.values(UserStatus), type: Number })
  accessLevel: number;
}

export const CategorySchema = SchemaFactory.createForClass(Category);
