import { Entity, ObjectIdColumn, Column, ManyToMany, JoinTable, CreateDateColumn } from 'typeorm';
import { ObjectId } from 'mongodb';
import { User } from '../../users/entities/user.entity';

@Entity()
export class Chat {
  @ObjectIdColumn()
  _id: ObjectId;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToMany(() => User) // Многие ко многим с пользователем
  @JoinTable()
  participants: User[];

  @Column()
  status: string; // Например, "active", "closed", "archived" и т.д.

  // Дополнительные поля и методы для работы с чатом
}
