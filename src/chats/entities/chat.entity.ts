/* eslint-disable import/no-cycle */
import { Entity, ObjectIdColumn, Column, UpdateDateColumn, CreateDateColumn } from 'typeorm';
import { ObjectId } from 'mongodb';
import { ApiResponseProperty } from '@nestjs/swagger';
import { IsDate } from 'class-validator';

export interface Message {
  id: string;
  sender: string;
  text: string;
  timestamp: Date;
}

@Entity()
export class Chat {
  @ObjectIdColumn()
  _id: ObjectId;

  @Column('simple-json')
  messages: Message[];

  @ApiResponseProperty()
  @CreateDateColumn()
  @IsDate()
  createdAt: Date;

  @ApiResponseProperty()
  @UpdateDateColumn()
  @IsDate()
  updatedAt: Date;
}
