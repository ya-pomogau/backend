import { Length, IsString, IsUrl, IsDate } from 'class-validator';
import {
  Entity,
  ObjectIdColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ObjectId,
} from 'typeorm';

enum VolunteerStatus {
  NOT_APPROVED = 'не одобрен',
  APPROVED = 'одобрен',
  APPROVED_CHECKED = 'одобрен и проверен',
  APPROVED_CHECKED_ACTIVATED = 'одобрен проверен активирован ключ',
}

@Entity()
export class Volunteer {
  @ObjectIdColumn()
  _id: ObjectId;

  @Column()
  @IsString()
  @Length(2, 30)
  fullname: string;

  @Column()
  @IsString()
  role: string;

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
  status: VolunteerStatus;

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

  //У волонтеров может быть несколько рецепиентов у рецпиентов много волонтеров

  //   @ManyToMany(() => Recepient)
  //   @JoinTable()
  //   items: Recepient[];

  //У тасок один волонтер(пока, м.б. нужна будет возможность нескольких назначать)

  // @OneToMany(() => Tasks, (task) => task.owner)
  // tasks: task[];
}
