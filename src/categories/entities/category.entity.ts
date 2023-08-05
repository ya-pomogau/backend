import { Column, CreateDateColumn, Entity, ObjectIdColumn } from "typeorm";
import { ObjectId } from 'mongodb';
import { IsInt, IsPositive, IsString, Length } from "class-validator";
import validationOptions from '../../common/constants/validation-options';

@Entity()
export class Category {
  @ObjectIdColumn()
  _id: ObjectId;

  @CreateDateColumn()
  createdAt: Date;

  @CreateDateColumn()
  updatedAt: Date;

  @Column()
  @IsString()
  @Length(validationOptions.limits.categoryTitle.min, validationOptions.limits.categoryTitle.max)
  title: string;

  @Column()
  @IsInt()
  @IsPositive()
  points: number;
}
