import { Column, CreateDateColumn, Entity, ObjectIdColumn, UpdateDateColumn } from 'typeorm';
import { ObjectId } from 'mongodb';
import { IsArray, IsInt, IsPositive, IsString, Length } from 'class-validator';
import validationOptions from '../../common/constants/validation-options';
import { UserStatus } from '../../users/types';

@Entity()
export class Category {
  @ObjectIdColumn()
  _id: ObjectId;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column()
  @IsString()
  @Length(validationOptions.limits.categoryTitle.min, validationOptions.limits.categoryTitle.max)
  title: string;

  @Column()
  @IsInt()
  @IsPositive()
  points: number;

  @Column()
  @IsArray()
  accessStatus: UserStatus;
}
