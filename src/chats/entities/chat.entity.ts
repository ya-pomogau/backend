import { Entity, ObjectIdColumn, Column, UpdateDateColumn, CreateDateColumn } from 'typeorm';
import { ObjectId } from 'mongodb';
import { ApiResponseProperty, ApiProperty } from '@nestjs/swagger'; // Импортируйте аннотации Swagger
import { IsDate } from 'class-validator';

export interface Message {
  id: string;
  sender: string;
  text: string;
  timestamp: Date;
}

@Entity()
export class Chat {
  @ObjectIdColumn()
  _id: ObjectId;

  @Column('simple-json')
  messages: Message[];

  @ApiResponseProperty()
  @CreateDateColumn()
  @IsDate()
  @ApiProperty({ description: 'Дата создания чата', type: Date })
  createdAt: Date;

  @ApiResponseProperty()
  @UpdateDateColumn()
  @IsDate()
  @ApiProperty({ description: 'Дата обновления чата', type: Date })
  updatedAt: Date;
}
