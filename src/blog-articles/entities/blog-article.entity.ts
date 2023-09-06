import { Column, CreateDateColumn, Entity, ObjectIdColumn, UpdateDateColumn } from 'typeorm';

import { IsString, Length, MinLength } from 'class-validator';

import { ObjectId } from 'mongodb';
import { ApiProperty, ApiResponseProperty } from '@nestjs/swagger';
import validationOptions from '../../common/constants/validation-options';

@Entity()
export class BlogArticle {
  @ApiResponseProperty({ type: 'string' })
  @ObjectIdColumn()
  _id: ObjectId;

  @ApiResponseProperty()
  @CreateDateColumn()
  createdAt: Date;

  @ApiResponseProperty()
  @UpdateDateColumn()
  updatedAt: Date;

  @ApiResponseProperty()
  @Column()
  authorId: string;

  @ApiResponseProperty()
  @Column()
  @IsString()
  @Length(
    validationOptions.limits.blogArticle.title.min,
    validationOptions.limits.blogArticle.title.max
  )
  @ApiProperty()
  title: string;

  @ApiResponseProperty()
  @Column()
  @IsString()
  @MinLength(validationOptions.limits.blogArticle.text.min)
  text: string;
}
