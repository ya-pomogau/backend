import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class MainAdmin {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column()
  password: string;
}
