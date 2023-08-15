import { Length, IsInt, IsDate } from 'class-validator';

export class CreateTaskDto {
  @Length(3, 30)
  title: string;

  @Length(20, 200)
  description: string;

  @IsInt()
  categoryId: number;

  @IsDate()
  date: Date;

  @Length(1, 50)
  address: string;
}
