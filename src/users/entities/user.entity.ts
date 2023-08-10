import { Length, IsString, IsUrl, IsDate } from 'class-validator';
import {
  Entity,
  ObjectIdColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ObjectId,
  OneToMany, JoinColumn, JoinTable
} from "typeorm";
import { Task } from "../../tasks/entities/task.entity";

export enum UserRole {
  CHIEF = 'Главный администратор',
  ADMIN = 'Администратор',
  RECIPIENT = 'Реципиент',
  VOLUNTEER = 'Волонтер',
}

@Entity()
export class User {
  @ObjectIdColumn()
  _id: ObjectId;

  @Column()
  @IsString()
  @Length(2, 20)
  fullname: string;

  @Column()
  @IsString()
  role: UserRole;

  @Column()
  @IsUrl()
  vk: string;

  @Column()
  @IsUrl()
  photo: string;

  @Column()
  @IsString()
  phone: string;

  @Column()
  @IsString()
  address: string;

  @Column()
  @IsString()
  coordinates: number[];

  @Column()
  approved: boolean;

  @Column()
  checked: boolean;

  @Column()
  keys: boolean;

  @Column()
  adminStatus: number;

  @Column()
  scores: number;

  @Column()
  completed: number;

  @CreateDateColumn()
  @IsDate()
  createdAt: Date;

  @UpdateDateColumn()
  @IsDate()
  updatedAt: Date;

  // Примерная логика связи сообщений

  // @OneToMany(() => Message, (message) => task.owner)
  // messages: message[];

  // У тасок один волонтер(пока, м.б. нужна будет возможность нескольких назначать)

  // @OneToMany(() => Tasks, (task) => task.owner)
  // tasks: task[];
}
