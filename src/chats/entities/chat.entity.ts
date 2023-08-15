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
  user: string;

  @Column()
  text: string;

  @Column()
  status: string; // Например, "active", "closed", "archived" и т.д.
  // Дополнительные поля и методы для работы с чатом
}
