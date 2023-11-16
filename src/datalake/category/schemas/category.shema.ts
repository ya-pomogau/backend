import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";
import { UserStatus } from "../../../users/types";

export interface ICategory {
  title: string;
  points: number;
  accessLevel: UserStatus;
}

@Schema({ timestamps: true })
export class Category implements ICategory {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true, type: Number })
  points: number;

  @Prop({ required: true, enum: Object.values(UserStatus), type: Number })
  accessLevel: number;
}

export const CategorySchema = SchemaFactory.createForClass(Category);
export type CategoryDocument = Category & Document;
