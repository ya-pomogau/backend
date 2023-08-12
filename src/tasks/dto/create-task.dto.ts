import { Length, IsDate, IsString, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateTaskDto {
  @Length(3, 30)
  title: string;

  @Length(20, 200)
  description: string;

  @IsString()
  categoryId: string;

  @IsDate()
  @Type(() => Date)
  completionDate: Date;

  @Length(1, 50)
  address: string;

  @IsString()
  recipientId: string;

  @IsString()
  @IsOptional()
  volunteerId: string;
}
