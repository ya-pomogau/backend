import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { UserStatus } from 'src/users/types'; //скорей всего будет лежать не там
import { Document } from 'mongoose';

export type CategoryDocument = Category & Document;

@Schema()
export class Category {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true, type: Number })
  points: number;

  @Prop({ required: true, type: UserStatus })
  accessLevel: UserStatus;

  @Prop({ required: true, type: Date, default: Date.now })
  createdAt: Date;

  @Prop({ required: true, type: Date, default: Date.now  })
  updatedAt: Date;
}

export const CategorySchema = SchemaFactory.createForClass(Category);

// Добавляем пре-хук для обновления updatedAt
CategorySchema.pre('findOneAndUpdate', function () {
  this.set({ updatedAt: new Date() });
});