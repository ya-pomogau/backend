import { Column, CreateDateColumn, Entity, ObjectIdColumn, UpdateDateColumn } from 'typeorm';
import { ObjectId } from 'mongodb';
import { IsArray, IsInt, IsPositive, IsString, Length } from 'class-validator';
import { ApiProperty, ApiResponseProperty } from '@nestjs/swagger';
import validationOptions from '../../common/constants/validation-options';
import { UserStatus } from '../../users/types';

@Entity()
export class Category {
  @ApiResponseProperty({ type: 'string' })
  @ObjectIdColumn()
  _id: ObjectId;

  @ApiResponseProperty()
  @CreateDateColumn()
  createdAt: Date;

  @ApiResponseProperty()
  @ApiProperty()
  @UpdateDateColumn()
  updatedAt: Date;

  @ApiResponseProperty()
  @Column()
  @IsString()
  @Length(validationOptions.limits.categoryTitle.min, validationOptions.limits.categoryTitle.max)
  title: string;

  @ApiResponseProperty()
  @Column()
  @IsInt()
  @IsPositive()
  points: number;

  @ApiResponseProperty()
  @Column()
  @IsArray()
  accessStatus: UserStatus;
}
