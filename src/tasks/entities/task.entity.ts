import { Column, CreateDateColumn, Entity, ObjectIdColumn } from 'typeorm';
import { IsDate, IsString, Length } from 'class-validator';

@Entity()
export class Task {
  @ObjectIdColumn()
  id: number;

  @CreateDateColumn()
  createdAt: Date;

  @CreateDateColumn()
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
  date: Date;

  @Column()
  @IsString()
  category: string; // заменить на ManyToOne

  @Column()
  @IsString()
  @Length(1, 50)
  address: string; // формат адреса?

  @Column()
  @IsString()
  recipient: string; // заменить на OneToMane

  @Column()
  @IsString()
  volunteer?: string; // заменить на OneToMane

  @Column()
  completed: {
    recipient?: boolean;
    volunteer?: boolean;
  };
}
