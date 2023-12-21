import { Column, Entity, ObjectId, ObjectIdColumn, PrimaryColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity()
export class Token {
  @ObjectIdColumn()
  _id: ObjectId;

  @PrimaryColumn()
  token: string;

  @Column()
  expiresIn: number;

  @Column()
  userId: User['_id'];

  constructor(partial?: Partial<Token>) {
    Object.assign(this, partial);
  }
}
