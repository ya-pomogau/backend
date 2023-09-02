import { ObjectId } from 'mongodb';
import { Column, Entity, ObjectIdColumn } from 'typeorm';

export interface Message {
  id: string;
  socketId: string;
  text: string;
  sender: string;
  recipient: string;
  file: string;
  isFrom: boolean;
  date: Date;
}

@Entity()
export class Chat {
  @ObjectIdColumn()
  id: ObjectId;

  // нужно сделать связь с конкретным пользователем

  @Column()
  messages: Message[];
}
