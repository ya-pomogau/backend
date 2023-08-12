import { Column, CreateDateColumn, Entity, ObjectIdColumn, UpdateDateColumn } from 'typeorm';
import { IsDate, IsInt, IsString, Length } from 'class-validator';
import { ObjectId } from 'mongodb';
import { User } from '../../users/entities/user.entity';

interface ITaskConfirmation {
  recipient: boolean | null;
  volunteer: boolean | null;
}

export enum Status {
  CREATED = 'created',
  ACCEPTED = 'accepted',
  CLOSED = 'closed',
}

interface IStatusHistory {
  date: Date;
  status: Status;
  completed: boolean;
  volunteer: User | null;
}

@Entity()
export class Task {
  @ObjectIdColumn()
  _id: ObjectId;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column()
  @IsString()
  @Length(3, 30)
  title: string;

  @Column()
  @IsString()
  @Length(20, 200)
  description: string;

  @Column()
  @IsDate()
  completionDate: Date;

  @Column()
  @IsString()
  categoryId: string;

  @Column()
  @IsString()
  @Length(1, 100)
  address: string;

  @Column()
  coordinates: [number, number];

  @Column(() => User)
  recipient: User;

  @Column(() => User)
  volunteer?: User;

  @Column()
  @IsInt()
  points: number;

  @Column()
  status: Status = Status.CREATED;

  @Column()
  taskHistory: IStatusHistory[] = [
    { date: new Date(), status: Status.CREATED, completed: false, volunteer: null },
  ];

  @Column()
  completed = false;

  @Column()
  confirmation: ITaskConfirmation = { recipient: null, volunteer: null };
}
