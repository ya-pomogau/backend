import { ObjectId } from 'mongodb';
import { Column, Entity, ObjectIdColumn } from 'typeorm';

export interface Message {
  id: string;
  sender: string;
  text: string;
}

@Entity()
export class Chat {
  @ObjectIdColumn()
  id: ObjectId;

  @Column()
  messages: Message[];
}
