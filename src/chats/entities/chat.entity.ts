/* eslint-disable import/no-cycle */
import { Entity, ObjectIdColumn, Column } from 'typeorm';
import { ObjectId } from 'mongodb';

interface Message {
  sender: string;
  recipient: string;
  text: string;
  timestamp: Date;
}

@Entity()
export class Chat {
  @ObjectIdColumn()
  _id: ObjectId;

  @Column()
  name: string;

  @Column('simple-json')
  messages: Message[];
}
