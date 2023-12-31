import { IsArray, IsDate, IsNumber, IsString, IsUrl, Length } from 'class-validator';

import { Column, CreateDateColumn, Entity, Index, ObjectIdColumn, UpdateDateColumn } from 'typeorm';
import { ObjectId } from 'mongodb';
import { Exclude } from 'class-transformer';
import { ApiResponseProperty } from '@nestjs/swagger';

import { AdminPermission, EUserRole, UserStatus } from '../types';

import validationOptions from '../../../src/common/constants/validation-options';

@Entity()
export class User {
  @ApiResponseProperty({ type: 'string' })
  @ObjectIdColumn()
  _id: ObjectId;

  @ApiResponseProperty()
  @Column()
  @IsString()
  @Length(validationOptions.limits.userName.min, validationOptions.limits.userName.max)
  fullname: string;

  @ApiResponseProperty()
  @Column()
  @IsString()
  role: EUserRole;

  @ApiResponseProperty()
  @IsNumber()
  @Column()
  @Index()
  vkId?: number;

  @ApiResponseProperty()
  @Column()
  @IsUrl()
  @Index()
  vkLink?: string;

  @Column()
  @IsString()
  @Exclude()
  @Index({ unique: true })
  login?: string;

  @Column({ select: false })
  @IsString()
  @Exclude()
  password?: string;

  @ApiResponseProperty()
  @Column()
  @IsString()
  status: UserStatus = UserStatus.UNCONFIRMED;

  @ApiResponseProperty()
  @Column()
  isBlocked = false;

  @ApiResponseProperty()
  @Column()
  @IsUrl()
  avatar: string;

  @ApiResponseProperty()
  @Column()
  @IsString()
  phone: string;

  @ApiResponseProperty()
  @Column()
  @IsString()
  address: string;

  @ApiResponseProperty()
  @Column()
  @IsString()
  coordinates: number[];

  @ApiResponseProperty()
  @CreateDateColumn()
  @IsDate()
  createdAt: Date;

  @ApiResponseProperty()
  @UpdateDateColumn()
  @IsDate()
  updatedAt: Date;

  @ApiResponseProperty()
  @Column()
  scores = 0;

  @ApiResponseProperty()
  @Column()
  @IsArray()
  permissions?: AdminPermission[];

  @ApiResponseProperty()
  @Column()
  completedTasks = 0;

  @ApiResponseProperty()
  @Column()
  lastActivityDate: Date | null = null;
}
