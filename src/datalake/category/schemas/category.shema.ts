import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { UserStatus } from 'src/users/types'; //скорей всего будет лежать не там
import { Document } from 'mongoose';

export type CategoryDocument = Category & Document;

@Schema({ timestamps: true }) // timestamps автоматическое отслеживание времени создания (createdAt) и времени обновления (updatedAt)
export class Category {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true, type: Number })
  points: number;

  @Prop({ required: true, type: UserStatus })
  accessLevel: UserStatus;
}

export const CategorySchema = SchemaFactory.createForClass(Category);