/* eslint-disable import/no-cycle */
import { Entity, ObjectIdColumn, Column, CreateDateColumn } from 'typeorm';
import { ObjectId } from 'mongodb';

@Entity()
export class Chat {
  @ObjectIdColumn()
  _id: ObjectId;

  @CreateDateColumn()
  createdAt: Date;

  @Column()
  sender: string;

  @Column()
  recipient: string;

  @Column()
  message: string;
}
