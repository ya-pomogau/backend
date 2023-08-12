import { Length, IsString, IsUrl, IsDate } from 'class-validator';
import { Entity, ObjectIdColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { ObjectId } from 'mongodb';
import { UserRole, StatusType, PermissionType } from '../../common/types/user-types';

@Entity()
export class User {
  @ObjectIdColumn()
  _id: ObjectId;

  @Column()
  @IsString()
  @Length(2, 20)
  fullname: string;

  @Column({ nullable: true })
  @IsString()
  role: UserRole | null;

  @Column({ nullable: true })
  status: StatusType = 'uncomfirmed';

  @Column()
  @IsUrl()
  vk: string;

  @Column()
  @IsUrl()
  avatar: string;

  @Column()
  @IsString()
  phone: string;

  @Column()
  @IsString()
  address: string;

  @Column()
  @IsString()
  coordinates: number[];

  @CreateDateColumn()
  @IsDate()
  createdAt: Date;

  @UpdateDateColumn()
  @IsDate()
  updatedAt: Date;

  @Column({ nullable: true })
  keys?: number | null;

  @Column()
  scores = 0;

  @Column()
  permissions?: Array<PermissionType> | null;

  // Примерная логика связи сообщений

  // @OneToMany(() => Message, (message) => task.owner)
  // messages: message[];

  // У тасок один волонтер(пока, м.б. нужна будет возможность нескольких назначать)

  // @OneToMany(() => Tasks, (task) => task.owner)
  // tasks: task[];
}
