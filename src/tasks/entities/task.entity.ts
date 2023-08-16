import { Column, CreateDateColumn, Entity, ObjectIdColumn, UpdateDateColumn } from 'typeorm';
import { IsDate, IsInt, IsString, Length } from 'class-validator';
import { ObjectId } from 'mongodb';
import { ApiProperty, ApiResponseProperty } from '@nestjs/swagger';
import { TaskConfirmation, TaskStatus } from '../types';
import validationOptions from '../../common/constants/validation-options';
import { UserStatus } from '../../users/types';

@Entity()
export class Task {
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
  @IsString()
  @Length(validationOptions.limits.task.title.min, validationOptions.limits.task.title.max)
  @ApiProperty()
  title: string;

  @ApiResponseProperty()
  @Column()
  @IsString()
  @Length(
    validationOptions.limits.task.description.min,
    validationOptions.limits.task.description.max
  )
  description: string;

  @ApiResponseProperty()
  @Column()
  @IsDate()
  completionDate: Date;

  @ApiResponseProperty()
  @Column()
  @IsString()
  categoryId: string;

  @ApiResponseProperty()
  @Column()
  @IsString()
  @Length(validationOptions.limits.address.min, validationOptions.limits.address.max)
  address: string;

  @ApiResponseProperty()
  @Column()
  coordinates: [number, number];

  @ApiResponseProperty()
  @Column()
  recipientId: string;

  @ApiResponseProperty()
  @Column()
  volunteerId?: string;

  @ApiResponseProperty()
  @Column()
  @IsInt()
  points: number;

  @ApiResponseProperty()
  @Column()
  accessStatus: UserStatus;

  @ApiResponseProperty()
  @Column()
  status: TaskStatus = TaskStatus.CREATED;

  @ApiResponseProperty()
  @Column()
  completed: boolean = false;

  @ApiResponseProperty()
  @Column()
  confirmation: TaskConfirmation = { recipient: null, volunteer: null };
}
