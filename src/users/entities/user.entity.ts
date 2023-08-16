import { IsArray, IsDate, IsString, IsUrl, Length } from 'class-validator';
import {Column, CreateDateColumn, Entity, Index, ObjectIdColumn, UpdateDateColumn} from 'typeorm';
import { ObjectId } from 'mongodb';
import { Exclude } from 'class-transformer';
import { AdminPermission, UserRole, UserStatus } from '../types';
import validationOptions from '../../common/constants/validation-options';

@Entity()
export class User {
  @ObjectIdColumn()
  _id: ObjectId;

  @Column()
  @IsString()
  @Length(validationOptions.limits.userName.min, validationOptions.limits.userName.max)
  fullname: string;

  @Column()
  @IsString()
  role: UserRole;

  @Column()
  @IsString()
  @Exclude()
  @Index({ unique: true })
  login?: string;

  @Column({ select: false })
  @IsString()
  @Exclude()
  password?: string;

  @Column()
  @IsString()
  status: UserStatus = UserStatus.UNCONFIRMED;

  @Column()
  isBlocked = false;

  @Column()
  @IsUrl()
  @Index({ unique: true })
  vk: string;

  @Column()
  @IsUrl()
  avatar: string;

  @Column()
  @IsString()
  phone: string;

  @Column()
  @IsString()
  address: string;

  @Column()
  @IsString()
  coordinates: number[];

  @CreateDateColumn()
  @IsDate()
  createdAt: Date;

  @UpdateDateColumn()
  @IsDate()
  updatedAt: Date;

  @Column()
  scores = 0;

  @Column()
  @IsArray()
  permissions?: AdminPermission[];
}
