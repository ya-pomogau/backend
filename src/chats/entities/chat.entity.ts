import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Chat {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    nullable: false,
    comment: 'Message is required',
  })
  message: string;

  @Column({
    nullable: false,
    comment: 'Sender is required',
  })
  sender: string;

  @Column({
    nullable: false,
    comment: 'Recipient is required',
  })
  recipient: string;

  @Column({
    nullable: false,
    comment: 'Time is required',
  })
  time: string;
}
