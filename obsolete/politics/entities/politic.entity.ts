import { Column, CreateDateColumn, Entity, ObjectIdColumn, UpdateDateColumn } from 'typeorm';

import { IsString } from 'class-validator';

import { ObjectId } from 'mongodb';
import { ApiProperty, ApiResponseProperty } from '@nestjs/swagger';

@Entity()
export class Politic {
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
  @ApiProperty()
  title: string;

  @ApiResponseProperty()
  @Column()
  @IsString()
  text: string;
}
