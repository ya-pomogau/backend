import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes } from 'mongoose';
import { UserStatus } from '../../../common/types/user.types';
import { CategoryInterface } from '../../../common/types/category.types';

@Schema({
  timestamps: true,
  toObject: {
    versionKey: false,
    virtuals: true,
    flattenObjectIds: true,
  },
  id: false,
})
export class Category extends Document implements CategoryInterface {
  @Prop({ required: true, immutable: true, type: SchemaTypes.String })
  title: string;

  @Prop({ required: true, type: SchemaTypes.Number })
  points: number;

  @Prop({ required: true, enum: UserStatus, type: SchemaTypes.Number })
  accessLevel: number;
}

export const CategorySchema = SchemaFactory.createForClass<CategoryInterface>(Category);
