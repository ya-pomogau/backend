import {IsArray, IsDate, IsString, IsUrl, Length} from 'class-validator';
import {Column, CreateDateColumn, Entity, ObjectIdColumn, UpdateDateColumn} from 'typeorm';
import {ObjectId} from 'mongodb';
import {AdminPermission, UserRole, UserStatus} from '../types';

@Entity()
export class User {
  @ObjectIdColumn()
  _id: ObjectId;

  @Column()
  @IsString()
  @Length(2, 30)
  fullname: string;

  @Column()
  @IsString()
  role: UserRole;

  @Column()
  @IsString()
  status: UserStatus = UserStatus.UNCONFIRMED;

  @Column()
  isBlocked = false;

  @Column()
  @IsUrl()
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
