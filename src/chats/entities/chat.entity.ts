/* eslint-disable import/no-cycle */
import { Entity, ObjectIdColumn, Column } from 'typeorm';
import { ObjectId } from 'mongodb';

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
}
