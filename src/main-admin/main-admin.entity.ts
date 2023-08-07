import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('main_admins')
export class MainAdmin {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  username: string;

  @Column()
  password: string;
}