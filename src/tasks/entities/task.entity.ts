import {Column, CreateDateColumn, Entity, ObjectIdColumn, UpdateDateColumn} from 'typeorm';
import {IsDate, IsInt, IsString, Length} from 'class-validator';
import {ObjectId} from 'mongodb';
import {ITaskConfirmation, TaskStatus} from '../types';
import validationOptions from '../../common/constants/validation-options';
import {UserStatus} from "../../users/types";

@Entity()
export class Task {
  @ObjectIdColumn()
  _id: ObjectId;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column()
  @IsString()
  @Length(validationOptions.limits.task.title.min, validationOptions.limits.task.title.max)
  title: string;

  @Column()
  @IsString()
  @Length(
    validationOptions.limits.task.description.min,
    validationOptions.limits.task.description.max
  )
  description: string;

  @Column()
  @IsDate()
  completionDate: Date;

  @Column()
  @IsString()
  categoryId: string;

  @Column()
  @IsString()
  @Length(validationOptions.limits.address.min, validationOptions.limits.address.max)
  address: string;

  @Column()
  coordinates: [number, number];

  @Column()
  recipientId: string;

  @Column()
  volunteerId?: string;

  @Column()
  @IsInt()
  points: number;

  @Column()
  accessStatus: UserStatus;

  @Column()
  status: TaskStatus = TaskStatus.CREATED;

  @Column()
  completed = false;

  @Column()
  confirmation: ITaskConfirmation = { recipient: null, volunteer: null };
}
