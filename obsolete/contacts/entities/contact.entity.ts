import { Column, CreateDateColumn, Entity, ObjectIdColumn, UpdateDateColumn } from 'typeorm';

import { IsArray, IsEmail } from 'class-validator';

import { ObjectId } from 'mongodb';
import { ApiResponseProperty } from '@nestjs/swagger';

@Entity()
export class Contact {
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
  @IsEmail()
  email: string | null = null;

  @ApiResponseProperty()
  @Column()
  @IsArray()
  social: string[] | null = null;
}
