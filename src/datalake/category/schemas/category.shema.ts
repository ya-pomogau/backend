import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { UserStatus } from '../../../common/types/user.types';

export interface ICategory {
  title: string;
  points: number;
  accessLevel: UserStatus;
}

@Schema({ timestamps: true }) // timestamps автоматическое отслеживание времени создания (createdAt) и времени обновления (updatedAt)
export class Category implements ICategory {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true, type: Number })
  points: number;

  @Prop({ required: true, type: UserStatus })
  accessLevel: UserStatus;
}

export type CategoryDocument = Category & Document;

export const CategorySchema = SchemaFactory.createForClass(Category);
