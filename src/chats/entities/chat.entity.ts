/* eslint-disable import/no-cycle */
import { Entity, ObjectIdColumn, OneToMany, Column, CreateDateColumn, ManyToMany } from 'typeorm';
import { ObjectId } from 'mongodb';
import { User } from '../../users/entities/user.entity';
import { Message } from '../../messages/entities/message.entity';

@Entity()
export class Chat {
  @ObjectIdColumn()
  _id: ObjectId;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToMany(() => User, (user) => user.chats) // Указываем также, как в User сущности
  participants: User[];

  @OneToMany(() => Message, (message) => message.chat) // Один ко многим с сообщениями
  messages: Message[];

  @Column()
  status: string; // Например, "active", "closed", "archived" и т.д.
  // Дополнительные поля и методы для работы с чатом
}
