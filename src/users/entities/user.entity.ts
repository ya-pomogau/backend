/* eslint-disable no-shadow */
import { Length, IsString, IsUrl, IsDate, ValidateNested } from 'class-validator';
import { Entity, ObjectIdColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { ObjectId } from 'mongodb';
import { Type } from 'class-transformer';
import { PermissionTypeDto } from '../dto/permisionType.dto';
import { PermissionTypeValidator } from '../dto/PermissionTypeValidator.dto';

export enum StatusType {
  Unconfirmed = 'unconfirmed',
  Confirmed = 'confirmed',
  Activated = 'activated',
  Verified = 'verified',
}

export enum UserRole {
  Master = 'master',
  Admin = 'admin',
  Recipient = 'recipient',
  Volunteer = 'volunteer',
}

@Entity()
export class User {
  @ObjectIdColumn()
  _id: ObjectId;

  @Column()
  @IsString()
  @Length(2, 20)
  fullname: string;

  @Column({ nullable: true })
  @IsString()
  role: UserRole | null;

  @Column({ nullable: true })
  status: StatusType = StatusType.Unconfirmed;

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

  @Column({ nullable: true })
  keys?: number | null;

  @Column()
  scores = 0;

  @Column()
  @ValidateNested({ each: true })
  @Type(() => PermissionTypeValidator)
  permissions?: PermissionTypeDto[] | null;
}
